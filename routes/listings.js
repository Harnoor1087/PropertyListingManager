const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Listing = require("../models/listing.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");

// ─── MULTER SETUP ─────────────────────────────────────────────────────────────
// multer handles multipart/form-data (file uploads).
// diskStorage lets us control where files are saved and what they're named.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Files go into the /uploads folder (created below)
    },
    filename: (req, file, cb) => {
        // Give each file a unique name: timestamp + original extension (e.g. 1714000000000.jpg)
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

// Only allow image file types
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);  // Accept the file
    } else {
        cb(new Error("Only image files are allowed."), false); // Reject
    }
};

const upload = multer({ storage, fileFilter });

// ─── LISTINGS CRUD ────────────────────────────────────────────────────────────

// GET /listings → Return all listings as JSON
// .populate("owner", "username email") replaces the owner ObjectId with { _id, username, email }
router.get("/", async (req, res) => {
    try {
        const listings = await Listing.find({}).populate("owner", "username email");
        res.status(200).json(listings);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch listings." });
    }
});

// GET /listings/:id → Return a single listing with owner and reviews populated
router.get("/:id", async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate("owner", "username email")
            .populate("reviews.author", "username"); // Populate author inside each review
        if (!listing) return res.status(404).json({ message: "Listing not found." });
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch listing." });
    }
});

// POST /listings → Create a new listing (protected)
// upload.single("listing[image]") processes the uploaded image file before the route handler runs
router.post("/", isLoggedIn, upload.single("listing[image]"), async (req, res) => {
    try {
        // req.body.listing contains the text fields from the FormData
        const listingData = req.body.listing || req.body;

        const newListing = new Listing({
            title: listingData.title,
            description: listingData.description,
            price: listingData.price,
            location: listingData.location,
            country: listingData.country,
            category: listingData.category,
            owner: req.session.userId, // Set owner to currently logged-in user
        });

        // If an image was uploaded, store its path and filename
        // Otherwise the schema default image URL is used
        if (req.file) {
            newListing.image = {
                url: `/uploads/${req.file.filename}`,
                filename: req.file.filename,
            };
        }

        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create listing." });
    }
});

// PUT /listings/:id → Update a listing (protected + ownership check)
router.put("/:id", isLoggedIn, upload.single("listing[image]"), async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: "Listing not found." });

        // Ownership check — convert ObjectId to string before comparing
        if (listing.owner.toString() !== req.session.userId.toString()) {
            return res.status(403).json({ message: "You are not authorised to edit this listing." });
        }

        const listingData = req.body.listing || req.body;
        listing.title       = listingData.title       ?? listing.title;
        listing.description = listingData.description ?? listing.description;
        listing.price       = listingData.price       ?? listing.price;
        listing.location    = listingData.location    ?? listing.location;
        listing.country     = listingData.country     ?? listing.country;
        listing.category    = listingData.category    ?? listing.category;

        if (req.file) {
            listing.image = {
                url: `/uploads/${req.file.filename}`,
                filename: req.file.filename,
            };
        }

        await listing.save();
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json({ message: "Failed to update listing." });
    }
});

// DELETE /listings/:id → Delete a listing (protected + ownership check)
router.delete("/:id", isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: "Listing not found." });

        if (listing.owner.toString() !== req.session.userId.toString()) {
            return res.status(403).json({ message: "You are not authorised to delete this listing." });
        }

        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Listing deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete listing." });
    }
});

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

// POST /listings/:id/reviews → Add a review to a listing (protected)
router.post("/:id/reviews", isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: "Listing not found." });

        const { comment, rating } = req.body.review || req.body;

        // Push a new review subdocument into the reviews array
        listing.reviews.push({
            comment,
            rating,
            author: req.session.userId, // Who wrote this review
        });

        await listing.save();

        // Return the newly added review (last item in the array)
        const newReview = listing.reviews[listing.reviews.length - 1];
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ message: "Failed to add review." });
    }
});

// DELETE /listings/:listingId/reviews/:reviewId → Delete a review (protected + ownership)
router.delete("/:listingId/reviews/:reviewId", isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);
        if (!listing) return res.status(404).json({ message: "Listing not found." });

        // Find the review inside the reviews array
        const review = listing.reviews.id(req.params.reviewId);
        if (!review) return res.status(404).json({ message: "Review not found." });

        // Only the review author can delete it
        if (review.author.toString() !== req.session.userId.toString()) {
            return res.status(403).json({ message: "You are not authorised to delete this review." });
        }

        // .pull() removes the subdocument from the array by id
        listing.reviews.pull(req.params.reviewId);
        await listing.save();

        res.status(200).json({ message: "Review deleted." });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete review." });
    }
});

module.exports = router;