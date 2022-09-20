const Joi = require("joi");

const validators = {
    favouriteValidator: Joi.object({
        name: Joi.string().min(3).max(250).label("Beverage Name").required(),
        brandName: Joi.string().min(3).max(180).label("Brand Name").required(),
        price: Joi.number().min(0).label("Price").required(),
        stock: Joi.number().min(0).label("Stock").required(),
        description: Joi.string().min(3).label("Description").required(),
        spec: Joi.string().min(3).label("Specification").required(),
        img: Joi.string().uri().label("Img URL").required()
    })
}

module.exports = validators