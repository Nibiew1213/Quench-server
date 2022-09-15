const mongoose = require('mongoose')
const { Schema } = mongoose;

const usersSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    preferredName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: "LineItem",
        }
    ],
    userType: {
        type: String,
        enum : ['user','admin'],
        default: 'user',
        required: true
    }
},

{timestamps : true}

);


module.exports = mongoose.model('Users', usersSchema)