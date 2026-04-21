const express = require("express");
const router = express.Router();       // A mini Express app — just for auth routes
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

// ─── REGISTER ────────────────────────────────────────────────────────────────

// GET /register → Show the registration form
router.get("/register", (req, res) => {
    res.render("auth/register.ejs");
});

// POST /register → Handle form submission
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body; // Destructure form fields

        // Check if a user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If yes, re-render the form with an error message
            return res.render("auth/register.ejs", { error: "Email already registered. Please login." });
        }

        // Hash the password before saving.
        // bcrypt.hash(plainText, saltRounds) returns a Promise resolving to the hash string.
        // We never store the plain text password.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user with the hashed password
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Storing hash, not plain text
        });
        await newUser.save();

        // Set the session — this is what "logs the user in"
        // req.session is provided by express-session middleware
        // We store the user's MongoDB _id so we can identify them on future requests
        req.session.userId = newUser._id;

        res.redirect("/listings"); // Redirect to main app

    } catch (err) {
        console.error(err);
        res.render("auth/register.ejs", { error: "Something went wrong. Please try again." });
    }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────

// GET /login → Show the login form
router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

// POST /login → Handle form submission
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            // No user found with that email
            return res.render("auth/login.ejs", { error: "Invalid email or password." });
        }

        // bcrypt.compare(plainText, hash) → returns true if they match, false otherwise.
        // bcrypt internally re-hashes the plain text using the salt stored in the hash string
        // and compares — so we never need to "decrypt" anything.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("auth/login.ejs", { error: "Invalid email or password." });
        }

        // Credentials are correct — set the session
        req.session.userId = user._id;

        res.redirect("/listings");

    } catch (err) {
        console.error(err);
        res.render("auth/login.ejs", { error: "Something went wrong. Please try again." });
    }
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

// GET /logout → Destroy the session and redirect to login
router.get("/logout", (req, res) => {
    // req.session.destroy() removes the session from the store (MongoDB) and clears the cookie
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect("/login");
    });
});

module.exports = router;