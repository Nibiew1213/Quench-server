const express = require('express')
const userController = require('../controllers/user-controller')

const router = express.Router()

//create user
router.post('/register', userController.registerUser)

//login
router.post('/login', userController.loginUser)





module.exports = router