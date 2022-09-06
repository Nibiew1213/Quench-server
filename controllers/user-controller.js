const userModel = require("../models/users-model");

const userValidator = require("../joi-validators/users");

module.exports = {
    registerUser: (req, res) => {
        res.send("user registered")
    }
};
