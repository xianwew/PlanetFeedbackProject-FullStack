const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const PlanetPins = require('../models/PlanetPin');
const {isLoggedIn, validatePin, isAuthor} = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const pins = await PlanetPins.find({});
    res.render('PlanetPins/index', { pins });
}));

router.get('/newPin', isLoggedIn, (req, res) => {
    res.render('PlanetPins/newPin');
});

router.post('/', isLoggedIn, validatePin, catchAsync(async (req, res) => {
    const pin = new PlanetPins(req.body.earthExplorer);
    pin.author = req.user._id;
    await pin.save();
    req.flash('success', 'successfully made a new planet pin!');
    res.redirect(`/earthExplorer/${pin._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!pin){
        req.flash('error', 'can not find that planet pin!');
        return res.redirect('/earthExplorer');
    }
    res.render('./PlanetPins/details', { pin });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    if(!pin){
        req.flash('error', 'can not find that planet pin!');
        return res.redirect(`/earthExplorer`);
    }
    res.render('./PlanetPins/edit', { pin });
}));

router.put('/:id', isLoggedIn, validatePin, isAuthor, catchAsync(async (req, res) => {
    const updatedPin = await PlanetPins.findByIdAndUpdate(req.params.id, { ...req.body.earthExplorer }, { runValidators: true });
    req.flash('success', 'successfully edited the planet pin!');
    res.redirect(`/earthExplorer/${updatedPin._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const deletePin = await PlanetPins.findByIdAndDelete(req.params.id);
    req.flash('warming', 'successfully deleted a planet pin!');
    res.redirect('/earthExplorer');
}));

module.exports = router;