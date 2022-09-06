const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        preferredName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        hash: {
            type: String,
            required: true,
            default: 0,
        },
        cart: [
            {
                type: Schema.Types.ObjectId,
                ref: "Beverage",
            },
        ],
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
            required: true,
        },
    },

    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
