const mongoose = require("mongoose");
const { Schema } = mongoose;

const PurchaseLineItemSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Beverage",
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "must have at least 1"]
        },
  
    },

    { timestamps: true }
);

const PurchaseLineItem = mongoose.model("PurchaseLineItem", PurchaseLineItemSchema);

module.exports = PurchaseLineItem;