// This function is a middleware — it runs before the actual route handler.
// Express always passes (req, res, next) to middleware.
// - req: the incoming request object
// - res: the outgoing response object
// - next: a function to call when this middleware is done and Express should move on

const isLoggedIn = (req, res, next) => {
    // req.session is made available by express-session middleware (set up in app.js).
    // When a user logs in, we store their _id as req.session.userId.
    // If that value exists, the user is authenticated — call next() to proceed.
    if (req.session && req.session.userId) {
        return next(); // User is logged in, continue to the route
    }
    // If userId is not in session, the user is not logged in.
    // Redirect them to the login page.
    res.redirect("/login");
};

module.exports = isLoggedIn;