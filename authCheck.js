const passport = require('passport');
const User = require('./models/user');

// global auth check.
let isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/auth/login');
        return false;
    }

    // if user is logged in, just continue original express callback
    return next();
};

module.exports = isAuthenticated;