const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/users-model");

const userValidator = require("../joi-validators/users");

module.exports = {
    registerUser: async (req, res) => {
        // res.send("user registered")
        let errorObject = {};

        //validate user reggo values
        const userValidationResults = userValidator.registerValidator.validate(
            req.body,
            { abortEarly: false }
        );

        //return joi validation error messages, if any
        if (userValidationResults.error) {
            const validationError = userValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        let validatedUserDetails = userValidationResults.value;

        //check for duplicate email
        try {
            let duplicateEmail = await userModel.findOne({
                email: validatedUserDetails.email,
            });

            if (duplicateEmail) {
                return res
                    .status(409)
                    .json({ error: "email has already been taken" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to get user" });
        }

        //bcrypt
        const registerHash = await bcrypt.hash(
            validatedUserDetails.password,
            10
        );

        //create user
        try {
            await userModel.create({
                fullName: validatedUserDetails.fullName,
                preferredName: validatedUserDetails.preferredName,
                email: validatedUserDetails.email,
                hash: registerHash,
            });

            return res.status(201).json({ success: "user created" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to create user" });
        }
    },

    loginUser: async (req, res) => {
        // res.send("user logged in")

        let errorObject = {};
        let errMsg = "invalid email or password";

        //validate user reggo values
        const loginValidationResults = userValidator.loginValidator.validate(
            req.body,
            { abortEarly: false }
        );

        //return joi validation error messages, if any
        if (loginValidationResults.error) {
            const validationError = loginValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        const loginValidated = loginValidationResults.value;

        try {
            let user = await userModel.findOne({ email: loginValidated.email });

            if (!user) {
                return res.status(400).json({ error: errMsg });
            }

            //generate JWT and return as response
            const userData = {
                email: user.email,
                name: user.name,
            };

            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
                    data: userData,
                },
                process.env.JWT_SECRET
            );

            return res.json({ token });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to log user in" });
        }
    },

    userProfile: async (req, res) => {
        let authUser = res.locals.authUser;
        let user = null;

        //this is authMiddleware in action
        if (!authUser) {
            console.log("authUser: ", authUser);
            return res.status(401).json();
        }

        try {
            user = await userModel.findOne(authUser.data, "-__v -role -hash")
            console.log("user: ", user)
        } catch (error) {
            return res.status(500).json({ error: "failed to get user" });
        }

        return res.json(user)
    },
};
