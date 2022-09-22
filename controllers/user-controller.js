const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userValidator = require("../joi-validators/users");
const userModel = require("../models/users-model");

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

        let userId = req.params.userId
        
        try {
            user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
        } catch (err) {
            console.log(err)
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
        let userAuth = res.locals.userAuth;

        if (!userAuth) {
            return res.status(401).json({ message: "Not authorised." });
        }

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

        let userId = req.params.userId;

        try {
            const user = await userModel.findById(userId); 
            if (!user) {
                return res.status(404).json(user);
            }
        } catch (error) {
            return res
                .status(500)
                .json({ error: `Failed to get user of id: ${userId}` });
        }

        try {
            console.log(req.body);
            // const response = await user.updateOne(req.body);
            const response = await userModel.findByIdAndUpdate(userId, {$set: req.body}, {new: true})
            const newUserData = {
                fullName: response.fullName,
                preferredName: response.preferredName,
                email: response.email,
                userId: response._id
            }
            res.status(201).json({ message: "profile updated!", newData: newUserData});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        let userAuth = res.locals.userAuth;

        if (!userAuth) {
            return res.status(401).json({ message: "Not authorised." });
        }

        try {
            let userId = req.params.userId;

            let userToDelete = await userModel.findByIdAndDelete(userId);

            if (!userToDelete) {
                return res.status(500).json({ error: "failed to delete user" });
            }

            res.status(200).json({ message: "Profile deleted" });
        } catch (error) {
            res.status(500).json({ error: "failed to delete user" });
        }
    }

    };
