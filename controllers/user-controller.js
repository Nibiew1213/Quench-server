const bcrypt = require("bcrypt");
const userModel = require("../models/users-model");
const userValidator = require("../joi-validators/users");
const lineItemModel = require("../models/lineItems-model");
const mongoose = require("mongoose");
const Beverage = require("../models/beverages-model");

module.exports = {
    register: async (req, res) => {
        // joi validations for register inputs
        let errorObject = {};

        const userValidationResults = userValidator.registerValidator.validate(
            req.body,
            {
                abortEarly: false,
            }
        );

        if (userValidationResults.error) {
            const validationError = userValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        let validatedUser = userValidationResults;

        try {
            validatedUser = await userModel.findOne({
                email: validatedUser.value.email,
            });

            if (validatedUser) {
                return res.status(409).json({ error: "user exists" });
            }
        } catch (err) {
            return res.status(500).json({ error: "failed to register user" });
        }

        const passHash = await bcrypt.hash(req.body.password, 10);
        const user = { ...req.body, password: passHash };

        try {
            await userModel.create(user);
            res.status(201).json({ success: "user created" });
        } catch (err) {
            res.status(500).json({ error: "failed to register user" });
        }
    },

    showUser: async (req, res) => {
        let user = null;
        let userAuth = res.locals.userAuth;

        if (!userAuth) {
            return res.status(401).json({ message: "Not authorised." });
        }

        const userId = req.params.userId
        
        try {
            user = await userModel.findbyId(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
        } catch (err) {
            return res.status(500).json({ error: "failed to get user" });
        }

        const userData = {
            fullName: user.fullName,
            preferredName: user.preferredName,
            email: user.email,
            userId: user._id
        };

        return res.json(userData);
    },

    editProfile: async (req, res) => {
        let errorObject = {};

        //validate user values
        const userValidationResults = userValidator.editValidator.validate(
            req.body,
            {
                abortEarly: false,
            }
        );

        //joi validation for edit profile
        if (userValidationResults.error) {
            const validationError = userValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        let userId = req.params._id;
        let user = null;

        try {
            user = await userModel.findById(userId);
        } catch (error) {
            return res
                .status(500)
                .json({ error: `Failed to get user of id: ${userId}` });
        }

        if (!user) {
            return res.status(404).json(user);
        }

        try {
            await user.updateOne(req.body);
            res.status(201).json({ message: "profile updated!" });
        } catch (error) {
            res.status(500).json({ error: "failed to update user" });
        }
    },

    deleteUser: async (req, res) => {
        try {
            let userId = req.params._id;

            let userToDelete = await userModel.findByIdAndDelete(userId);

            if (!userToDelete) {
                return res.status(500).json({ error: "failed to delete user" });
            }

            res.status(200).json({ message: "Profile deleted" });
        } catch (error) {
            res.status(500).json({ error: "failed to delete user" });
        }
    },

    addToCart: async (req, res) => {
        const userId = req.params._id;
        const beverageId = req.body.beverageId;
        const quantity = req.body.quantity;

        try {
            //check if line item already exists
            let lineItemExists = await lineItemModel.findOne({
                user: mongoose.Types.ObjectId(`${userId}`),
                product: mongoose.Types.ObjectId(`${beverageId}`),
            })

            //if exists, update quantity instead
            if(lineItemExists) {
                await lineItemModel.findByIdAndUpdate(lineItemExists._id,{
                    $inc: {
                        quantity
                    }
                })

                return res.status(200).json({ message: "item added to cart" });
            }


            //create line item
            let lineItem = await lineItemModel.create({
                user: mongoose.Types.ObjectId(`${userId}`),
                product: mongoose.Types.ObjectId(`${beverageId}`),
                quantity
            });

            //push line item to cart
            const user = await userModel.findByIdAndUpdate(userId, {
                $push: {
                    cart: lineItem._id,
                },
            });

            if (!user) {
                return res.status(404).json({ message: "user not found" });
            }

            return res.status(200).json({ message: "item added to cart" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "unable to add item to cart!" });
        }
    },

    //edit item in cart
    updateCart: async (req, res) => {
        const lineItemId = req.params.lineItemId
        const quantity = req.body.quantity;

        try {
            await lineItemModel.findByIdAndUpdate(lineItemId, {
                quantity
            })

            res.status(200).json({ message: "cart updated" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "unable to update cart!" });
        }
    },

    //remove from cart
    removeFromCart: async (req, res) => {
        const userId = req.params._id;
        const lineItemId = req.params.lineItemId

        try {
            //remove from lineItem collection
            await lineItemModel.findByIdAndDelete(lineItemId)

            //remove lineItemId from cart array
            await userModel.findByIdAndUpdate(userId, {
                $pull: {
                    cart: mongoose.Types.ObjectId(`${lineItemId}`)
                }
            }) 
            res.status(200).json({ message: "Item removed from cart!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "unable remove item from cart!" });
        }
    },

    //show cart
    showCart: async (req, res) => {
        res.send("wow this is ur whole cart")
    },


    //await findbyid(userid).populate({path: 'cart'})
};
