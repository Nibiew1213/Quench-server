const express = require('express')
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middleware/auth-middleware')

const router = express.Router()

//create user
router.post('/register', userController.registerUser)

//login
router.post('/login', userController.loginUser)

//profile
router.get('/profile/:userId', authMiddleware, userController.userProfile)



module.exports = router