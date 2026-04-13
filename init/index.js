const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("connected to DB.");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async() => {
    await Listing.deleteMany({}); // to delete the random data in the database and then use the data in the data.js file.
    await Listing.insertMany(initData.data);
    console.log("data was initialised.");
}

initDB();