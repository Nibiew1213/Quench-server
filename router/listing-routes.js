const express = require('express')
const listingController = require('../controllers/listing-controller')

const router = express.Router()


router.get('/', listingController.fetchListings)

//create listing
router.post('/', listingController.createListing)

//edit listing
router.put('/:listingId', listingController.editListing)


module.exports = router