const express = require('express');
const router = express.Router();
const passport = require('passport');
//docs for google auth https://www.passportjs.org/concepts/authentication/google/
const googlePassport = require('passport-google-oauth').OAuth2Strategy;;
const User = require('../models/user');




router.get('/register', (req, res) => {
    res.render('auth/register', { 
        title: 'Register',
        user: req.user 
    });
})

router.post('/register', (req, res) => {
    // use passport local to try creating a new user w/hashed pw
    User.register(new User({ username: req.body.username, password: req.body.password}), req.body.password, (err, newUser) => {
        if (err) {
            console.log(err);
            return res.render('auth/register');
        }
        else {
            req.login(newUser, (err) => {
                res.redirect('/transactions');
            });
        }
    });
});

router.get('/login', (req, res) => {
    // get any err messages from session
    let messages = req.session.messages || [];
    
    // clear out session error messages
    req.session.messages = [];

    res.render('auth/login', { 
        title: 'Login',
        messages: messages,
        user: req.user
     });
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/transactions',
    failureRedirect: '/auth/login',
    failureMessage: 'Invalid Login'
}));

router.get('/logout', (req, res) => {
    req.session.messages = [];
    req.logout((err) => {
        res.redirect('/');
    });
});

router.get('/unauthorized', (req, res) => {
    res.render('auth/unauthorized', {
        title: 'Unauthorized',
        user: req.user
    });
});

module.exports = router;