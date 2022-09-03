const express = require('express')
const listingController = require('../controllers/listing-controller')

const router = express.Router()



//createListing Route
router.post('/', listingController.createListing)

router.patch('/:listingId', listingController.editListing)


module.exports = router