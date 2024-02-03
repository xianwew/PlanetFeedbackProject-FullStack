const PlanetPins = require('../models/PlanetPin');
const {cloudinary} = require('../cloudinary');
const AppError = require('../utils/ExpressError')

module.exports.index = async (req, res) => {
    const pins = await PlanetPins.find({});
    res.render('PlanetPins/index', { pins });
}

module.exports.new = (req, res) => {
    res.render('PlanetPins/newPin');
}

module.exports.createNewPin = async (req, res) => {
    if(!req.files){
        throw new AppError('You must have images of this planet pin!', 400);
    }
    const pin = new PlanetPins(req.body.earthExplorer);
    pin.author = req.user._id;
    pin.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await pin.save();
    //console.log(pin);
    req.flash('success', 'successfully made a new planet pin!');
    res.redirect(`/earthExplorer/${pin._id}`);
}

module.exports.viewPin = async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!pin) {
        req.flash('error', 'can not find that planet pin!');
        return res.redirect('/earthExplorer');
    }
    res.render('./PlanetPins/details', { pin });
}

module.exports.editPin = async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    if (!pin) {
        req.flash('error', 'can not find that planet pin!');
        return res.redirect(`/earthExplorer`);
    }
    res.render('./PlanetPins/edit', { pin });
}

module.exports.postEdit = async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    let curImages = pin.images.length;
    if(req.files){
        curImages += req.files.length;
    }
    if((req.body.deleteImages && (curImages - req.body.deleteImages.length < 1))){
        throw new AppError('Invalid edit! You can not delete all the images of this planet pin!', 400);
    }
    const updatedPin = await PlanetPins.findByIdAndUpdate(req.params.id, { ...req.body.earthExplorer }, { runValidators: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedPin.images.push(...imgs);
    await updatedPin.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await updatedPin.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(updatedPin);
    }
    req.flash('success', 'successfully edited the planet pin!');
    res.redirect(`/earthExplorer/${updatedPin._id}`);
}

module.exports.deletePin = async (req, res) => {
    const deletePin = await PlanetPins.findByIdAndDelete(req.params.id);
    if(deletePin.images){
        for(let img of deletePin.images){
            await cloudinary.uploader.destroy(img.filename);
        }
    }
    req.flash('warming', 'successfully deleted a planet pin!');
    res.redirect('/earthExplorer');
}