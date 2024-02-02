const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, username });
        const registedUser = await User.register(user, password);
        req.login(registedUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Planet Feedback!');
            res.redirect('/earthExplorer');
        });
    }
    catch (e) {
        req.flash('error', 'User already exists!');
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/earthExplorer';
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/earthExplorer');
    });
});

module.exports = router;