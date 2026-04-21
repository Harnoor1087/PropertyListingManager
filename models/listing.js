const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ─── Review Subdocument Schema ─────────────────────────────────────────────────
// Reviews are embedded inside each Listing document (not a separate collection).
// This means each listing carries its own reviews array in the same MongoDB document.
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    // ref: "User" tells Mongoose this ObjectId points to a User document.
    // We can later call .populate("author") to replace the id with the full user object.
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// ─── Listing Schema ────────────────────────────────────────────────────────────
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    // image is now an object with url and filename (needed for multer/cloudinary later)
    // For now we store a default URL. The Angular model expects { url, filename }.
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        },
        filename: {
            type: String,
            default: "default",
        },
    },

    price: Number,
    location: String,
    country: String,
    category: String,

    // owner references the User who created this listing
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    // reviews is an array of embedded reviewSchema subdocuments
    reviews: [reviewSchema],

}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;