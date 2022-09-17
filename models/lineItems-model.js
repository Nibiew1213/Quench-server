const mongoose = require("mongoose");
const { Schema } = mongoose;

const LineItemSchema = new mongoose.Schema(
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

const LineItem = mongoose.model("LineItem", LineItemSchema);

module.exports = LineItem;