const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
       type: String,
       required: true,
    },
    description: String,
    image: { // as we are going to store the URL of image
        type: String,
        default: "https://unsplash.com/photos/a-butterfly-sips-nectar-from-a-pink-flower-rFjyEaAFbfA", // Adding image as default if no image of the property is posted by the user
        set: (v) => v ==="" ? "https://unsplash.com/photos/a-butterfly-sips-nectar-from-a-pink-flower-rFjyEaAFbfA" : v, // set will check that the image provided by the user has a link of it or not if not then the default will be displayed otherwise the one provided by the user will be used.
    }, 
    price: Number,
    location: String,
    country: String,
});

// Creating a Model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; // Exporting our model