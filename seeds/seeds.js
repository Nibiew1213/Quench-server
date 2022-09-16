const mongoose = require('mongoose');
const Beverage = require('../models/beverages-model')
const seedBeverage = require('./drinks/drinks.json')
require("dotenv").config();
const dbName = "Quench"

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_HOST}?retryWrites=true&w=majority`,{ dbName: dbName  } )
  .then(() => {
    console.log('Mongo connection open!')
  })
  .catch((err) => {
    console.log(err);
  });

  const seedDB = async() => {
    await Beverage.deleteMany({})
    await Beverage.insertMany(seedBeverage)
    console.log("Data seeded!")
  };

  seedDB().then(() => {
    mongoose.connection.close()
    console.log("Connection closed!")
  });

