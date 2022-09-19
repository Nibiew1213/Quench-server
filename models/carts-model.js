const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        lineItems: [{
                type: Schema.Types.ObjectId,
                ref: "LineItem",
                unique: true
        }],
        checkedOut: {
            type: Boolean,
            default: false,
            required: true
        }
  
    },

    { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;