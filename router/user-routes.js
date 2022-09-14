const express = require('express')
const usersController = require('../controllers/user-controller')
const authController = require('../controllers/auth-controller')
const authMiddleware = require('../middlewares/authmiddleware')

const router = express.Router()

// create user account, save in database
router.post('/auth/register', usersController.register)

// login user account
router.post('/auth/login', authController.login)

// show user profile
router.get('/profile/:_id', authMiddleware, usersController.showUser)

// edit user account
router.put('/profile/:_id/editProfile', usersController.editProfile)

// change user password
router.put('/profile/:_id/changePassword', authController.changePassword)

// delete user account
router.delete('/profile/:_id/deleteUser', usersController.deleteUser)

// add item to cart
router.post('/profile/:id/addToCart', usersController.addToCart)

module.exports = router
