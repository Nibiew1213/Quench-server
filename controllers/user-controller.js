const userModel = require("../models/users-model");

const userValidator = require("../joi-validators/users");
const { beverageValidator } = require("../joi-validators/beverages");

module.exports = {
    registerUser: (req, res) => {
        // res.send("user registered")

        let errorObject = {}

        //validate user reggo values
        const userValidationResults = userValidator.registerValidator.validate(req.body, {
            abortEarly: false,
        })

        if (userValidationResults.error) {
            const validationError = userValidationResults.error.details

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

    }
};
