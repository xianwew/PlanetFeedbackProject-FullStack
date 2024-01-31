const express = require('express');
const router = express.Router({mergeParams: true});
const PlanetPins = require('../models/PlanetPin');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../validationSchema');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    const newReview = new Review(req.body.review);
    pin.reviews.push(newReview);
    await pin.save();
    await newReview.save();
    res.redirect(`/earthExplorer/${req.params.id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    const pin = await PlanetPins.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = Review.findByIdAndDelete(reviewId);
    res.redirect(`/earthExplorer/${id}`);
}));

module.exports = router;