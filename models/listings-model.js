const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brandName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    spec: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    timestamps: true
});

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing