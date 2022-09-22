const express = require('express')
const authController = require('../controllers/auth-controller')
const cartController = require('../controllers/cart-controller')
const usersController = require('../controllers/user-controller')

const authMiddleware = require('../middlewares/authmiddleware')

const router = express.Router()

// create user account, save in database
router.post('/auth/register', usersController.register)

// login user account
router.post('/auth/login', authController.login)

// show user profile
router.get('/profile/:userId', authMiddleware, usersController.showUser)

// edit user account
router.put('/profile/:userId/editProfile', authMiddleware, usersController.editProfile)

// change user password
router.put('/profile/:userId/changePassword', authMiddleware,authController.changePassword)

// delete user account
router.delete('/profile/:userId/deleteUser', authMiddleware,usersController.deleteUser)

// add item to cart
router.post('/:userId/cart', authMiddleware, cartController.addToCart)

// update to cart
router.patch('/:userId/cart/lineItem/:lineItemId', authMiddleware, cartController.updateCart)

// remove from cart
router.delete('/:userId/cart/lineItem/:lineItemId', authMiddleware, cartController.removeFromCart)

// show cart
router.get('/:userId/cart', authMiddleware, cartController.showCart)

// purchase items
router.post('/:userId/cart/checkout', authMiddleware, cartController.checkout)


module.exports = router
