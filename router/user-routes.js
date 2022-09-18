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
router.get('/profile/:userId', authMiddleware, usersController.showUser)

// edit user account
router.put('/profile/:userId/editProfile', usersController.editProfile)

// change user password
router.put('/profile/:userId/changePassword', authController.changePassword)

// delete user account
router.delete('/profile/:userId/deleteUser', usersController.deleteUser)

// add item to cart
router.post('/:userId/cart', usersController.addToCart)

// update to cart
router.patch('/:userId/cart/lineItem/:lineItemId', usersController.updateCart)

// remove from cart
router.delete('/:userId/cart/lineItem/:lineItemId', usersController.removeFromCart)

// show cart
router.get('/:userId/cart', usersController.showCart)

// purchase items
router.post('/:userId/cart/purchase', usersController.purchase)


module.exports = router
