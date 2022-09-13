const express = require('express')
const usersController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/authmiddleware')

const router = express.Router()

//create user account, save in database
router.post('/auth/register', usersController.register)

//login user account
router.post('/auth/login', usersController.login)

//show user profile
router.get('/profile/:_id', authMiddleware, usersController.showUser)

//edit user account
router.put('/profile/:_id/editProfile', usersController.editProfile)

// declaring of route in server side requires react to call the correct endpoint
// API endpoint and react URL is independent of each other.

router.put('/profile/:_id/changePassword', usersController.changePassword)

//delete user account
router.delete('/delete-user/:_id', usersController.deleteUser)
//router.delete(/profile/:userId/delete', usersController.deleteUser) ???



module.exports = router
