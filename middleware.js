const PlanetPins = require('./models/PlanetPin');
const catchAsync = require('./utils/catchAsync');
const {pinSchema} = require('./validationSchema');
const {reviewSchema} = require('./validationSchema');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        console.log(res.locals.returnTo);
    }
    // console.log('abab ' + res.locals.returnTo);
    next();
}

module.exports.isAuthor = catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const pin = await PlanetPins.findById(id);
    if(!pin.author.equals(req.user._id)){
        req.flash('error', "You don't have the permission to do that!");
        return res.redirect(`/earthExplorer/${id}`);
    }
    next();
})

module.exports.isReivewAuthor = catchAsync(async(req, res, next) => {
    const {reviewId, id} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You don't have the permission to do that!");
        return res.redirect(`/earthExplorer/${id}`);
    }
    next();
})

module.exports.validatePin = (req, res, next) => {
    const {error} = pinSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}