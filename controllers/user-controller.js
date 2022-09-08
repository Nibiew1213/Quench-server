const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/users-model');
const userValidator = require("../joi-validators/users");

module.exports = {
    register: async (req, res) => {
        // do validations ...
        let errorObject = {}

        const userValidationResults = userValidator.userValidator.validate(req.body, {
            abortEarly: false,
        })

        if (userValidationResults.error) {
            const validationError = userValidationResults.error.details;

            validationError.forEach((error) => {
                errorObject[error.context.key] = error.message;
            });

            return res.status(400).json(errorObject);
        }

        let validatedUser = userValidationResults;

        try {
            validatedUser = await userModel.findOne({ email: validatedUser.email })
            if (validatedUser) {
                return res.status(409).json({error: "user exists"})
            }
        } catch (err) {
            return res.status(500).json({error: "failed to register user"})
        }

        const passHash = await bcrypt.hash(req.body.password, 10)

        //three dots is to spread, password after is to replace what has been spread
        const user = {...req.body, password: passHash}
    

        try {
            await userModel.create(user)
            return res.status(201).json({ success: "user created" });
        } catch (err) {
            console.log(err)
            return res.status(500).json({error: "failed to register user"})
        }
        
    },    
    
    login: async (req, res) => {
        // do validations ...

        const validatedUser = req.body
        let errMsg = "user email or password is incorrect"
        let user = null

        try {
            user = await userModel.findOne({ email: validatedUser.email })
            if (!user) {
                return res.status(401).json({error: errMsg})
            }
        } catch (err) {
            return res.status(500).json({error: "failed to get user"})
        }

        const isPasswordOk = await bcrypt.compare(req.body.password, user.password)

        if (!isPasswordOk) {
            return res.status(401).json({error: errMsg})
        } else {
            res.send("login successful")
        }       
    },

    showUser: async (req, res) => {
        // let user = null
        // let userAuth = res.locals.userAuth

        // if (!userAuth) {
        //     console.log(userAuth)
        //     return res.status(401).json()
        // }

        // try {
        //     user = await userModel.findOne({ email: userAuth.data.email })
        //     if (!user) {
        //         return res.status(404).json()
        //     }
        // } catch (err) {
        //     return res.status(500).json({error: "failed to get user"})
        // }

        // const userData = {
        //     fullName: user.fullName,
        //     preferredName: user.preferredName,
        //     email: user.email
        // }

        // return res.json(userData)

        
             
    },

    editUser: async (req, res) => {
        // try {
        //     const userId = req.params.userId
        //     const editUser = req.body
        //     let updatedUser = await userModel.findOneAndUpdate(userId, editUser)  
        //     console.log(updatedUser);
         
        // } catch (err) {
        //     return res.status(500).json({error: "failed to update user"})
        // }
        res.send("edit route working")
    },

    deleteUser: async (req, res) => {
        // try {
        //     let userId = req.params.userId
            
        //     await userModel.findByIdAndDelete(userId)
        //     res.redirect('/')
        // } catch (error) {
        //     console.log(error)
        // }
        res.send("delete route working")
    },
}