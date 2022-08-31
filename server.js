require("dotenv").config();

const express = require('express')
const mongoose = require("mongoose");

const app = express()
const port = process.env.port || 8000

const mongoConnectionStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@generalassembly.ljkj0.mongodb.net/?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
  try {
    await mongoose.connect(mongoConnectionStr, { dbName: "quencher" });
  } catch (err) {
    console.log(`Failed to connect to DB`);
    process.exit(1);
  }

  console.log(`Example app listening on port ${port}`);
});