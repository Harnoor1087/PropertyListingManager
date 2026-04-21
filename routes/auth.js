const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

// ─── SIGNUP ───────────────────────────────────────────────────────────────────

// POST /signup → Create a new user account
// Angular's AuthService calls: POST http://localhost:8080/signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check for duplicate email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // 409 Conflict — resource already exists
            return res.status(409).json({ message: "Email already registered." });
        }

        // Check for duplicate username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: "Username already taken." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Set session
        req.session.userId = newUser._id;

        // Return JSON — Angular's AuthService expects { user, message }
        // We never send the password field back to the client
        res.status(201).json({
            message: "Account created successfully.",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────

// POST /login → Authenticate an existing user
// Angular's AuthService calls: POST http://localhost:8080/login
// Note: Angular's login form sends { username, password } — NOT email
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body; // username, not email

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            // 401 Unauthorized — don't reveal whether it was username or password that was wrong
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Set session
        req.session.userId = user._id;

        res.status(200).json({
            message: "Logged in successfully.",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

// GET /logout → Destroy the session
// Angular's AuthService calls: GET http://localhost:8080/logout
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out." });
        }
        res.status(200).json({ message: "Logged out successfully." });
    });
});

// ─── ME ───────────────────────────────────────────────────────────────────────

// GET /me → Return the currently logged-in user (used by Angular on page refresh)
// When Angular app boots, it checks this route to restore session state.
// If session cookie is valid → return user object
// If not → 401, Angular clears localStorage and redirects to login
router.get("/me", async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated." });
    }
    try {
        // Find user by session id, exclude password from result using .select("-password")
        const user = await User.findById(req.session.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;