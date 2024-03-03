const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.route('/login')
    .get(users.getLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.route('/register')
    .get(users.getRegisterForm)
    .post(catchAsync(users.postRegister));

router.get('/logout', users.logout);

module.exports = router;