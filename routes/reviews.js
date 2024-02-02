const express = require('express');
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const {validateReview} = require('../middleware');
const {isLoggedIn, isReivewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.postReview));

router.delete('/:reviewId', isLoggedIn, isReivewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;