const express = require('express')
const favouriteController = require('../controllers/favourite-controller')

const router = express.Router()

//fetch beverages
router.get('/', beverageController.fetchBeverages)

//show beverage
router.get('/:beverageId', beverageController.showBeverage)

//create beverage
router.post('/', beverageController.createBeverage)

//edit beverage
router.put('/:beverageId', beverageController.editBeverage)

//delete beverage
router.delete('/:beverageId', beverageController.deleteBeverage)



module.exports = router