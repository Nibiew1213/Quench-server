const express = require('express')
const usersController = require('../controllers/user-controller')

const router = express.Router()

//display registration form
router.get('/register', usersController.register)

//create user account, save in database
router.post('/register', usersController.register)

//display login page
router.get('/login', usersController.login)

//login user account
router.post('/login', usersController.login)

//show user profile
router.get('/profile/:userId', usersController.showUser)

//edit user account
router.put('/edit-user/:userId', usersController.editUser)

//delete user account
router.delete('/delete-user/:userId', usersController.deleteUser)



module.exports = router