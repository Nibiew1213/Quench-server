require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const beverageRouter = require('./router/beverage-routes')
const userRouter = require('./router/user-routes')

const app = express();
const port = process.env.PORT || 8000;
const mongoConnectionStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_HOST}?retryWrites=true&w=majority`;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.use('/api/v1/beverages/', beverageRouter)
app.use('/api/v1/users/', userRouter)

app.get("/", (req, res) => {
    res.send("Hello World! This is Project 3 server");
});


app.listen(port, async () => {
    try {
        await mongoose.connect(mongoConnectionStr, {
            dbName: process.env.MONGO_DB,
        });
    } catch (err) {
        console.log(`Failed to connect to DB`);
        process.exit(1);
    }

    console.log(`Quencher app listening on port ${port}`);
});
