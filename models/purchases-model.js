const mongoose = require("mongoose");
const { Schema } = mongoose;

const PurchaseSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        purchases: {
            type: Schema.Types.ObjectId,
            ref: "PurchaseLineItem",
        }

    },

    { timestamps: true }
);

const Purchase = mongoose.model("Purchase", PurchaseSchema);

module.exports = Purchase;