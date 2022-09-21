const mongoose = require("mongoose");
const { Schema } = mongoose;

const favouritesSchema = new mongoose.Schema(
    {
        // name: {
        //     type: String,
        //     required: true,
        // },
        // brandName: {
        //     type: String,
        //     required: true,
        // },
        // price: {
        //     type: Number,
        //     required: true,
        // },
        // description: {
        //     type: String,
        //     required: true,
        // },
        // spec: {
        //     type: String,
        //     required: true,
        // },
        // img: {
        //     type: String,
        //     required: true,
        // },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Beverage",
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
    },

    { timestamps: true }
);

const Favourite = mongoose.model("Favourite", favouritesSchema);

module.exports = Favourite;


// //in the model
// {
//     user: {ref user},
//     product: {ref bef}
// }

// //before .popoulate()


// {
//     _id: <favouritesId>
//     user: ,
//     product
// }


// {
//     _id: <favouritesId>
//     user: ,
//     product :{
//         _id: <beverageID>,
//         price:,    }
// }