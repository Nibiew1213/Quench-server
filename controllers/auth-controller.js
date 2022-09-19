const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/users-model")
const userValidator = require("../joi-validators/users")

module.exports = {
  login: async (req, res) => {
    // joi login validations
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

      console.log(user)
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
      userId: user._id,
    }
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        data: userData,
      },
      process.env.JWT_SECRET
    )

    return res.json({ token, userData })
  },

  changePassword: async (req, res) => {
    // joi validations for change of password
    let errorObject = {}

    const passwordValidationResults =
      userValidator.changePasswordValidator.validate(req.body, {
        abortEarly: false,
      })

    if (passwordValidationResults.error) {
      const validationError = passwordValidationResults.error.details

      validationError.forEach((error) => {
        errorObject[error.context.key] = error.message
      })

      return res.status(400).json(errorObject)
    }
    // check if user exists in database
    let userId = req.params.userId
    try {
      const checkUser = await userModel.findById(userId)

      if (!checkUser) {
        res.status(404).json({ message: "User does not exists" })
      }

      // retreive current password from db
      // check current password is correct as per the user in the database (bcryptcompare)
      const isPasswordOk = await bcrypt.compare(
        req.body.currentPassword,
        checkUser.password
      )

      if (!isPasswordOk) {
        return res.status(401).json({ message: "Incorrect current password" })
      }

      // check new password and confirm password is same. if not return error
      if (req.body.newPassword !== req.body.confirmNewPassword) {
        return res.status(400).json({
          message: "New password and confirm new password does not match",
        })
      }

      // if db password and req.body password matches, return error
      const passHash = await bcrypt.hash(req.body.newPassword, 10)
      const isPasswordSame = await bcrypt.compare(
        req.body.newPassword,
        checkUser.password
      )

      if (isPasswordSame) {
        return res.status(409).json({ message: "Please enter new password" })
      }

      // implement new password change, then update password in database
      try {
        await userModel.findByIdAndUpdate(userId, {
          password: passHash,
        })
        return res.status(201).json({ success: "password updated" })
      } catch (err) {
        return res.status(500).json({ error: "failed to update password" })
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error" })
    }
  },
}
