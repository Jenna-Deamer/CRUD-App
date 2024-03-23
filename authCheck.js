const passport = require('passport');
const User = require('./models/user');

// global auth check.
let isAuthenticated = (req, res, next) => {
  // Check if the requested route is the dashboard route
    if (req.originalUrl === '/transactions') {
        return next();
    }

    // For other routes, check if the user is authenticated
    if (!req.isAuthenticated()) {
        // If user is not authenticated, redirect to the login page
        res.redirect('/auth/login');
        return false;
    }
    // if user is logged in, just continue original express callback
    return next();
};

module.exports = isAuthenticated;