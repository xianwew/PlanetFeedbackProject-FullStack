const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validatePin, isAuthor} = require('../middleware');
const earthExplorers = require('../controllers/earthExplorer');

router.get('/', catchAsync(earthExplorers.index));

router.get('/newPin', isLoggedIn, earthExplorers.new);

router.post('/', isLoggedIn, validatePin, catchAsync(earthExplorers.createNewPin));

router.get('/:id', catchAsync(earthExplorers.viewPin));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(earthExplorers.editPin));

router.put('/:id', isLoggedIn, validatePin, isAuthor, catchAsync(earthExplorers.postEdit));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(earthExplorers.deletePin));

module.exports = router;