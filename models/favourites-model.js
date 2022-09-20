const mongoose = require("mongoose");

const favouritesSchema = new mongoose.Schema(
    {
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
            default: 0,
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
    },

    { timestamps: true }
);

const Favourite = mongoose.model("Favourite", favouritesSchema);

module.exports = Favourite;
