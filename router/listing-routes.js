const express = require('express')
const listingController = require('../controllers/listing-controller')

const router = express.Router()

//fetch listings
router.get('/', listingController.fetchListings)

//show listing
router.get('/:listingId', listingController.showListing)

//create listing
router.post('/', listingController.createListing)

//edit listing
router.put('/:listingId', listingController.editListing)

//delete listing
router.delete('/:listingId', listingController.deleteListing)



module.exports = router