const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");       // For creating and managing sessions
const MongoStore = require("connect-mongo").MongoStore;      // Stores sessions in MongoDB (not in-memory)
const isLoggedIn = require("./middleware/isLoggedIn.js"); // Our auth guard middleware
const authRoutes = require("./routes/auth.js");   // All login/register/logout routes

// ─── DB CONNECTION ─────────────────────────────────────────────────────────────

main().then(() => {
    console.log("connected to DB.");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// ─── APP SETTINGS ──────────────────────────────────────────────────────────────

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────

app.use(express.urlencoded({ extended: true })); // Parse form data from POST requests
app.use(methodOverride("_method"));              // Allow PUT and DELETE from HTML forms

// Session middleware — must be set up BEFORE any routes that use req.session
app.use(session({
    secret: "wanderlust_secret_key",  // Used to sign the session ID cookie. Use a strong random string in production.
    resave: false,                    // Don't re-save session to store if nothing changed
    saveUninitialized: false,         // Don't create a session until something is stored (e.g., after login)
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/wanderlust", // Store sessions in our existing DB
        ttl: 14 * 24 * 60 * 60,      // Session expiry: 14 days (in seconds)
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000, // Cookie expiry: 14 days (in milliseconds)
        httpOnly: true,                    // JS on the page cannot access this cookie (security)
    }
}));

// ─── AUTH ROUTES (PUBLIC) ──────────────────────────────────────────────────────
// These must come BEFORE the protected listing routes.
// /login, /register, /logout are all handled inside authRoutes.
app.use("/", authRoutes);

// ─── ROOT ROUTE ────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
    res.redirect("/listings"); // Root redirects to listings (isLoggedIn will handle it from there)
});

// ─── PROTECTED LISTING ROUTES ──────────────────────────────────────────────────
// isLoggedIn is passed as a second argument — it runs before the route handler.
// If the user is not logged in, they get redirected to /login.

// Index Route → Show all listings
app.get("/listings", isLoggedIn, async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// New Route → Show form to create a listing
app.get("/listings/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route → Show a particular listing by ID
app.get("/listings/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found.");
    res.render("listings/show.ejs", { listing });
});

// Create Route → Save a new listing
app.post("/listings", isLoggedIn, async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit Route → Show pre-filled edit form
app.get("/listings/:id/edit", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found.");
    res.render("listings/edit.ejs", { listing });
});

// Update Route → Apply edits to a listing
app.put("/listings/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

// Delete Route → Remove a listing
app.delete("/listings/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// ─── SERVER ────────────────────────────────────────────────────────────────────

app.listen(8080, () => {
    console.log("Server listening to port 8080.");
});