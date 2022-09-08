const Joi = require("joi");

const validators = {
    userValidator: Joi.object({
        fullName: Joi.string().min(3).max(30).label("Full Name").required(),
        preferredName: Joi.string().min(3).max(30).label("Preferred Name").required(),
        email: Joi.string().trim().email().label("Email").required(),
        password: Joi.string().min(4).label("Password").required(),
        confirmPassword: Joi.string().equal(Joi.ref("password")).required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
    })
}

module.exports = validators