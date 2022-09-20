const favouriteModel = require("../models/favouritess-model");

const favouriteValidator = require("../joi-validators/favourites");

module.exports = {
    fetchFavourites: async (req, res) => {
        let allfavourites = [];

        try {
            allfavourites = await favouriteModel.find();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "unable to fetch favourites" });
        }

        return res.json(allfavourites);
    },

    showBeverage: async (req, res) => {
        let beverageId = req.params.beverageId;

        try {
            const beverage = await favouriteModel.findById(beverageId);

            if (!beverage) {
                return res.status(404).json();
            }

            return res.json(beverage);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "unable to fetch beverage" });
        }
    },

    createBeverage: async (req, res) => {
        // res.send("created beverage")

        let errorObject = {};

        //validate beverage values
        const beverageValidationResults =
            favouriteValidator.favouriteValidator.validate(req.body, {
                abortEarly: false,
            });

        //return joi validation error messages, if any
        if (beverageValidationResults.error) {
            const validationError = beverageValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        let validatedbeverage = beverageValidationResults;

        try {
            validatedbeverage = await favouriteModel.findOne({
                name: validatedbeverage.name,
            });

            if (validatedbeverage) {
                return res.status(409).json({ error: "beverage exists" });
            }

            // await favouriteModel.create(req.body);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to get beverage" });
        }

        const beverage = req.body;

        try {
            await favouriteModel.create(beverage);
            return res.status(201).json({ success: "beverage created" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to create beverage" });
        }

        return res.json();
    },

    editBeverage: async (req, res) => {
        let errorObject = {};

        //validate beverage values
        const beverageValidationResults =
            favouriteValidator.favouriteValidator.validate(req.body, {
                abortEarly: false,
            });

        //return joi validation error messages, if any
        if (beverageValidationResults.error) {
            const validationError = beverageValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        let beverageId = req.params.beverageId;

        let beverage = null;

        try {
            beverage = await favouriteModel.findById(beverageId);
        } catch (error) {
            return res
                .status(500)
                .json({ error: `Failed to get beverage of id: ${beverageId}` });
        }

        if (!beverage) {
            return res.status(404).json(beverage);
        }

        try {
            await beverage.updateOne(req.body);
        } catch (error) {
            return res.status(500).json({ error: "failed to update beverage" });
        }

        return res.status(201).json();
    },

    deleteBeverage: async (req, res) => {
        try {
            let beverageId = req.params.beverageId;

            await favouriteModel.findByIdAndDelete(beverageId);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "failed to delete beverage" });
        }

        return res.status(201).json();
    },
};
