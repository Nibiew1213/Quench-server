const express = require('express')
const listingController = require('../controllers/listing-controller')

const router = express.Router()

//createListing Router
router.post('/', listingController.createListing)

module.exports = router