const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next(); // Authenticated — proceed to route handler
    }
    // Not authenticated — return 401 JSON.
    // Angular's authInterceptor will catch this and redirect to /login automatically.
    res.status(401).json({ message: "You must be logged in." });
};

module.exports = isLoggedIn;