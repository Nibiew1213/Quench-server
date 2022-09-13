const bcrypt = require("bcrypt")
const userModel = require("../models/users-model")
const userValidator = require('../joi-validators/users')

module.exports = {
  register: async (req, res) => {
    // do validations ...
    let errorObject = {}

    const userValidationResults = userValidator.registerValidator.validate(
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

    let validatedUser = userValidationResults

    try {
      validatedUser = await userModel.findOne({
        email: validatedUser.value.email,
      })

      if (validatedUser) {
        return res.status(409).json({ error: "user exists" })
      }
    } catch (err) {
      return res.status(500).json({ error: "failed to register user" })
    }

    const passHash = await bcrypt.hash(req.body.password, 10)

    //three dots is to spread, password after is to replace what has been spread
    const user = { ...req.body, password: passHash }

    try {
      await userModel.create(user)
      return res.status(201).json({ success: "user created" })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: "failed to register user" })
    }
  },

  showUser: async (req, res) => {
    let user = null
    let userAuth = res.locals.userAuth

    if (!userAuth) {
      console.log(userAuth)
      return res.status(401).json({ message: "Not authorised." })
    }

    try {
      user = await userModel.findOne({ email: userAuth.data.email })
      if (!user) {
        return res.status(404).json()
      }
    } catch (err) {
      return res.status(500).json({ error: "failed to get user" })
    }

    const userData = {
      fullName: user.fullName,
      preferredName: user.preferredName,
      email: user.email,
    }

    return res.json(userData)
  },

  editProfile: async (req, res) => {
    // try {
    //   let userId = req.params._id
    //   let editUser = req.body

    //   await userModel.findByIdAndUpdate(userId, editUser)
    // //   await userModel.findOneAndUpdate({ _id: userId }, editUser)
    //   return res.send("profile updated")
    // } catch (err) {
    //   return res.status(500).json({ error: "failed to update user" })
    // }

    let errorObject = {}

    //validate user values
    const userValidationResults = userValidator.editValidator.validate(
      req.body,
      {
        abortEarly: false,
      }
    )

    //return joi validation error messages, if any
    if (userValidationResults.error) {
      const validationError = userValidationResults.error.details

      validationError.forEach((error) => {
        errorObject[error.context.key] = error.message
      })

      return res.status(400).json(errorObject)
    }

    let userId = req.params._id
    let user = null

    try {
      user = await userModel.findById(userId)
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Failed to get user of id: ${userId}` })
    }

    if (!user) {
      return res.status(404).json(user)
    }

    try {
      await user.updateOne(req.body)
    } catch (error) {
      return res.status(500).json({ error: "failed to update user" })
    }

    return res.status(201).json({ message: "profile updated!" })
  },

  changePassword: async (req, res) => {
    // do password joi validations
    let errorObject = {}

    const passwordValidationResults = userValidator.changePasswordValidator.validate(req.body, 
        {
            abortEarly: false,
        })

    if (passwordValidationResults.error) {
      const validationError = passwordValidationResults.error.details

      validationError.forEach((error) => {
        errorObject[error.context.key] = error.message
      })

      return res.status(400).json(errorObject)
    }
    // req.params.userId, check if user exists
    let userId = req.params._id
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
      // check new password and confirm password is same. if not return error (new password and confirm password do not match)
      if (req.body.newPassword !== req.body.confirmNewPassword) {
        return res.status(400).json({
          message: "New password and confirm new password does not match",
        })
      }

      // if db password and req.body password matches, return error "please enter new password"
      const passHash = await bcrypt.hash(req.body.newPassword, 10)
      const isPasswordSame = await bcrypt.compare(req.body.newPassword, checkUser.password)

      if (isPasswordSame) {
        return res.status(409).json({ message: "Please enter new password" })
      }
      // proceed to implement new password change, password then update in database
      try {
        await userModel.findByIdAndUpdate(userId, {
          password: passHash
        })
        return res.status(201).json({ success: "password updated" })
      } catch (err) {
        return res.status(500).json({ error: "failed to update password" })
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error" })
    }
  },

  deleteUser: async (req, res) => {
    try {
      let userId = req.params._id
      await userModel.findByIdAndDelete(userId)
      res.status(200).json({ message: "Profile deleted" })
    } catch (error) {
      res.status(500).json({ error: "failed to delete user" })
    }
  },
}
