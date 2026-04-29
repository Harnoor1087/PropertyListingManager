const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const cors = require("cors");                                        // Cross-Origin Resource Sharing
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;

// ─── ENSURE UPLOADS FOLDER EXISTS ─────────────────────────────────────────────
// multer will crash on the first upload if this folder doesn't exist.
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listings.js");

// ─── DB CONNECTION ─────────────────────────────────────────────────────────────

main().then(() => {
    console.log("Connected to MongoDB.");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Must be configured BEFORE session and routes.
// origin: Angular dev server URL
// credentials: true → allows session cookies to be sent with cross-origin requests
// Without this, the browser blocks all requests from Angular (localhost:4200) to Express (localhost:8080)
app.use(cors({
    origin: "http://localhost:4200",
    credentials: true,
}));

// ─── BODY PARSERS ─────────────────────────────────────────────────────────────
app.use(express.json());                         // Parse JSON bodies (Angular sends JSON for auth)
app.use(express.urlencoded({ extended: true })); // Parse form-encoded bodies (multer FormData)

// ─── STATIC FILES ─────────────────────────────────────────────────────────────
// Serve uploaded images as static files.
// e.g. GET http://localhost:8080/uploads/1714000000000.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── SESSION ──────────────────────────────────────────────────────────────────
app.use(session({
    secret: "wanderlust_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/wanderlust",
        ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // sameSite: "none" + secure: false → required so browsers send this cookie
        // on cross-origin AJAX requests (Angular :4200 → Express :8080).
        // With "lax", browsers silently drop the cookie on POST/PUT/DELETE mutations.
        sameSite: "none",
        secure: false,   // must be false when running on plain HTTP (local dev)
    },
}));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/", authRoutes);                // /signup, /login, /logout, /me
app.use("/listings", listingRoutes);     // /listings and /listings/:id/reviews

// ─── SERVER ───────────────────────────────────────────────────────────────────
app.listen(8080, () => {
    console.log("Server listening on port 8080.");
});