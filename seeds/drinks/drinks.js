const DrinksJson = require('./drinks.json')
const DrinkModel = require('../../models/beverages-model')

const createDrinks = async (drinks) => {
  const xx = await DrinkModel.create(drinks)
  console.log(`Created ${xx.length} drinks`)
}

module.exports = createDrinks(DrinksJson)