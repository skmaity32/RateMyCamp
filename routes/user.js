const express = require('express');
const router = express.Router();

const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

// Renders the register form
router.get('/register', (req, res) => {
    res.render('users/register');
})

// Handles register logic using useful methods from passport and passport-local-mongoose
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });

        // registers a new user instance with a given password and checks if username is unique
        // register method provided by passport-local-mongoose
        const registeredUser = await User.register(user, password);

        // Passport exposes a login() function on req (also aliased as logIn())
        // that can be used to establish a login session.
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to RateMyCamp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

// Renders the login form
router.get('/login', (req, res) => {
    res.render('users/login');
})

// Authentication is performed using passport.authenticate() method as a middleware
// By default, when authentication succeeds, the req.user property is set to the authenticated user,
// a login session is established, and the next function in the stack is called
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'You have logged in successfully! Welcome back!');
    const redirectUrl = '/campgrounds';
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    // Passport exposes a logout() function on req (also aliased as logOut()) 
    // that can be called from any route handler which needs to terminate a login session.
    // Invoking logout() will remove the req.user property and clear the login session (if any).
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have been logged out!');
        res.redirect('/campgrounds');
    });
})

module.exports = router;