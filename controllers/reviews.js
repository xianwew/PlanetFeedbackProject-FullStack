const PlanetPins = require('../models/PlanetPin');
const Review = require('../models/review');

module.exports.postReview = async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    pin.reviews.push(newReview);
    await pin.save();
    await newReview.save();
    req.flash('success', 'successfully created a new review!');
    res.redirect(`/earthExplorer/${req.params.id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    const pin = await PlanetPins.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = Review.findByIdAndDelete(reviewId);
    req.flash('warming', 'successfully deleted a review!');
    res.redirect(`/earthExplorer/${id}`);
}