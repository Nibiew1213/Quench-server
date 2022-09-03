const listingModel = require("../models/listings-model");

const listingValidator = require("../joi-validators/listings")

module.exports = {
    createListing: async (req, res) => {
        // res.send("created listing")

        let errorObject = {}

        //validate listing values
        const listingValidationResults = listingValidator.listingValidator.validate(
            req.body,
            {abortEarly: false}
        )
        
        //return joi validation error messages, if any
        if (listingValidationResults.error) {
            const validationError = listingValidationResults.error.details

            validationError.forEach(error => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject)
        }


        let validatedListing = listingValidationResults

        try {
            
            validatedListing = await listingModel.findOne({name: validatedListing.name })

            if (validatedListing) {
                return res.status(409).json({error: "listing exists"})
            }

            // await listingModel.create(req.body);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "failed to get listing" });
        }

        const listing = req.body

        try {
            await listingModel.create(listing)
            return res.status(201).json({success: "listing created"})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "failed to create listing" });
        }

        return res.json();
    },
};
