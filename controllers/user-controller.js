const bcrypt = require('bcrypt')

const userModel = require("../models/users-model");

const userValidator = require("../joi-validators/users");

module.exports = {
    registerUser: async (req, res) => {
        // res.send("user registered")

        let errorObject = {};

        //validate user reggo values
        const userValidationResults = userValidator.registerValidator.validate(req.body,{abortEarly: false,});

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
        const registerHash = await bcrypt.hash(validatedUserDetails.password, 10)

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
};
