const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/users-model")
const userValidator = require("../joi-validators/users")

module.exports = {
    login: async (req, res) => {
        // do validations ...
        let errorObject = {}
    
        const userValidationResults = userValidator.loginValidator.validate(
          req.body,
          {
            abortEarly: false,
          }
        )
    
        if (userValidationResults.error) {
          const validationError = userValidationResults.error.details
    
          validationError.forEach((error) => {
            errorObject[error.context.key] = error.message
          })
    
          return res.status(400).json(errorObject)
        }
    
        const validatedUser = req.body
        let errMsg = "user email or password is incorrect"
        let user = null
    
        try {
          user = await userModel.findOne({ email: validatedUser.email })
          if (!user) {
            return res.status(401).json({ error: errMsg })
          }
        } catch (err) {
          return res.status(500).json({ error: "failed to get user" })
        }
    
        const isPasswordOk = await bcrypt.compare(req.body.password, user.password)
    
        if (!isPasswordOk) {
          return res.status(401).json({ error: errMsg })
        }
    
        // generate JWT and return as response
        const userData = {
          fullName: user.fullName,
          preferredName: user.preferredName,
          email: user.email,
        }
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
            data: userData,
          },
          process.env.JWT_SECRET
        )
    
        return res.json({ token })
      },
}