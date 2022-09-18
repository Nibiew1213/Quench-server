const Joi = require("joi");

const validators = {
    createCartValidator: Joi.object(),
    addToCartValidator: Joi.object({
        beverageId: Joi.string().label("Beverage Id").required(),
        quantity: Joi.number().min(1).label("Quantity").required(),
    }),
    updateCartValidator: Joi.object({
        quantity: Joi.number().min(1).label("Quantity").required(),
    }),
}

module.exports = validators