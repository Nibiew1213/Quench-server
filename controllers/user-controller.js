const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/users-model")
const userValidator = require("../joi-validators/users")

module.exports = {
  register: async (req, res) => {
    // do validations ...
    let errorObject = {}

    const userValidationResults = userValidator.registerValidator.validate(req.body,{
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
   
    const isPasswordOk = await bcrypt.compare(req.body.password, user.passwordgit )

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

    let errorObject = {};

    //validate user values
    const userValidationResults = userValidator.editValidator.validate(req.body, {
            abortEarly: false,
        })

    //return joi validation error messages, if any
    if (userValidationResults.error) {
        const validationError = userValidationResults.error.details;

        validationError.forEach((error) => {
            errorObject[error.context.key] = error.message;
        })

        return res.status(400).json(errorObject);
    }

    let userId = req.params._id;
    let user = null;

    try {
        user = await userModel.findById(userId);
    } catch (error) {
        return res
            .status(500)
            .json({ error: `Failed to get user of id: ${userId}` });
    }

    if (!user) {
        return res.status(404).json(user);
    }

    try {
        await user.updateOne(req.body);
    } catch (error) {
        return res.status(500).json({ error: "failed to update user" });
    }

    return res.status(201).json({ message: "profile updated!"})
  },
  

  changePassword: async (req, res) => {

    // let errorObject = {}

    // const passwordValidationResults = userValidator.changePasswordValidator.validate(req.body, {
    //     abortEarly: false,
    //   })

    // if (passwordValidationResults.error) {
    //   const validationError = passwordValidationResults.error.details

    //   validationError.forEach((error) => {
    //     errorObject[error.context.key] = error.message
    //   })

    //   return res.status(400).json(errorObject)
    // }
    // // expect req.body {currentpw, newPassword, confirmnewPass}
    // // req.params.userId, check if user exists
    // // retreive current password from db await find by id.password
    // // check current password is correct as per the user in the database (bcryptcompare)
    // const currentPassword = req.body
    // let errMsg = "current password is incorrect"
    // let oldPassword = null

    // try {
    //   oldPassword = await userModel.findById({ password: currentPassword.password })
    //   if (!oldPassword) {
    //     return res.status(401).json({ error: errMsg })
    //   }
    // } catch (err) {
    //   return res.status(500).json({ error: "server error" })
    // }

    // const isPasswordOk = await bcrypt.compare(req.body.password, user.password)

    // if (!isPasswordOk) {
    //   return res.status(401).json({ error: errMsg })
    // }
    // try catch, if db password and req.body password matches,
    // proceed to implement new password change
    // if new password matches old password, return error " please enter new password"
    // else check new password and confirm password is same. if not return error (new password and confirm password do not match)
    // else hash new password then update in database
  

    try {
        let userId = req.params._id
        const passHash = await bcrypt.hash(req.body.password, 10) 
        const updatePassword = { ...req.body, password: passHash }

        await userModel.findByIdAndUpdate(userId, updatePassword)
        
        return res.status(201).json({ success: "password updated" })
      } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "failed to update password" })
      }

  },

  deleteUser: async (req, res) => {
    try {
        let userId = req.params._id
        await userModel.findByIdAndDelete(userId)
        res.send("Profile deleted")
    }  catch (error) {
        return res.status(500).json({error: "failed to delete user"})
    }
    return res.status(200).json()
  },
}
