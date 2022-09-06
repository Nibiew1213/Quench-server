const Joi = require("joi");

const validators = {
    registerValidator: Joi.object({
        fullName: Joi.string().min(3).max(140).label("Full Name").required(),
        preferredName: Joi.string()
          .min(3)
          .max(60)
          .label("Preferred Name")
          .required(),
        email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .label("Email")
          .required(),
        password: Joi.string().min(3).label("Password").required(),
        confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
          "any.only": '"Passwords" must match',
        }),
      }),

      loginValidator: Joi.object({
        email: Joi.string().email().label("Email").required(),
        password: Joi.string().label("Password").required(),
      }),
}

module.exports = validators