const listingModel = require("../models/listings-model");

const listingValidator = require("../joi-validators/listings");

module.exports = {

    fetchListings: async (req, res) => {
        let allListings = []

        try {
            allListings = await listingModel.find()
        } catch (error) {
            console.log(error)
            res.status(500).json({error: "unable to fetch listings"})
        }

        return res.json(allListings)

    },

    createListing: async (req, res) => {
        // res.send("created listing")

        let errorObject = {};

        //validate listing values
        const listingValidationResults =
            listingValidator.listingValidator.validate(req.body, {
                abortEarly: false,
            });

        //return joi validation error messages, if any
        if (listingValidationResults.error) {
            const validationError = listingValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        let validatedListing = listingValidationResults;

        try {
            validatedListing = await listingModel.findOne({
                name: validatedListing.name,
            });

            if (validatedListing) {
                return res.status(409).json({ error: "listing exists" });
            }

            // await listingModel.create(req.body);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to get listing" });
        }

        const listing = req.body;

        try {
            await listingModel.create(listing);
            return res.status(201).json({ success: "listing created" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed to create listing" });
        }

        return res.json();
    },

    editListing: async (req, res) => {
        let errorObject = {};

        //validate listing values
        const listingValidationResults =
            listingValidator.listingValidator.validate(req.body, {
                abortEarly: false,
            });

        //return joi validation error messages, if any
        if (listingValidationResults.error) {
            const validationError = listingValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        let listingId = req.params.listingId;

        let listing = null;

        try {
            listing = await listingModel.findById(listingId);
        } catch (error) {
            return res
                .status(500)
                .json({ error: `Failed to get listing of id: ${listingId}` });
        }

        if (!listing) {
            return res.status(404).json(listing);
        }

        try {
            await listing.updateOne(req.body);
        } catch (error) {
            return res.status(500).json({ error: "failed to update listing" });
        }

        return res.status(201).json();
    },


};
