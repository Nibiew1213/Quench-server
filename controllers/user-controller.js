const userModel = require("../models/users-model");

const userValidator = require("../joi-validators/users");
const { beverageValidator } = require("../joi-validators/beverages");

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
        console.log(validatedUserDetails)
        //check for duplicate
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

        try {
            await userModel.create({
                fullName: validatedUserDetails.fullName,
                preferredName: validatedUserDetails.preferredName,
                email: validatedUserDetails.email,
                hash: validatedUserDetails.password,
            });

            return res.status(201).json({ success: "user created" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to create user" });
        }
    },
};
