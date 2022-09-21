const express = require('express')
const authController = require('../controllers/auth-controller')
const cartController = require('../controllers/cart-controller')
const usersController = require('../controllers/user-controller')
const favouriteController = require('../controllers/favourite-controller')

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
router.post('/:userId/cart', cartController.addToCart)

// update to cart
router.patch('/:userId/cart/lineItem/:lineItemId', cartController.updateCart)

// remove from cart
router.delete('/:userId/cart/lineItem/:lineItemId', cartController.removeFromCart)

// show cart
router.get('/:userId/cart', cartController.showCart)

// purchase items
router.post('/:userId/cart/purchase', cartController.purchase)

// //fetch favourites
router.get('/:userId/favourite', favouriteController.fetchFavourites)

//create favourite beverage
router.post('/:userId/favourite', favouriteController.createFavourite)

//delete favourite beverage
router.delete('/:userId/favourite/:beverageId', favouriteController.deleteFavourite)

// //show favourite beverage
// router.get('/:userId/favourite/:beverageId', favouriteController.showFavourite)

// //edit favourite
// router.put('/:beverageId', favouriteController.editBeverage)

module.exports = router
