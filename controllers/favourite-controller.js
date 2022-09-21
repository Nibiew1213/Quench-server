const favouriteModel = require("../models/favourites-model");

const favouriteValidator = require("../joi-validators/favourites");

module.exports = {
    
    fetchFavourites: async (req, res) => {
        try {
            const allfavourites = await favouriteModel.find().populate('product', 'name brandName price description spec img');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "unable to fetch favourites" });
        }
        return res.json(allfavourites);
    },

    createFavourite: async (req, res) => {
        // res.send("created favourite beverage")

        let errorObject = {};

        //validate favourite beverage values
        const favouriteValidationResults =
            favouriteValidator.favouriteValidator.validate(req.body, {
                abortEarly: false,
            });

        //return joi validation error messages, if any
        if (favouriteValidationResults.error) {
            const validationError = favouriteValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        let validatedfavourite = favouriteValidationResults;

        try {
            validatedfavourite = await favouriteModel.findOne({
                name: validatedbeverage.name,
            });

            if (validatedfavourite) {
                return res.status(409).json({ error: "favourite beverage exists" });
            }

            // await favouriteModel.create(req.body);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to get favourite beverage" });
        }

        const favourite = req.body;

        try {
            await favouriteModel.create(favourite).populate('product', 'name brandName price description spec img');
            return res.status(201).json({ success: "favourite beverage created" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to create favourite beverage" });
        }

        return res.json();
    },

    deleteFavourite: async (req, res) => {
        try {
            let favouriteId = req.params.favouriteId;

            await favouriteModel.findByIdAndDelete(favouriteId);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "failed to delete favourite beverage" });
        }
        return res.status(201).json();
    },

};
