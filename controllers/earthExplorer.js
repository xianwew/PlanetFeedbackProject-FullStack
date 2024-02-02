const PlanetPins = require('../models/PlanetPin');


module.exports.index = async (req, res) => {
    const pins = await PlanetPins.find({});
    res.render('PlanetPins/index', { pins });
}

module.exports.new = (req, res) => {
    res.render('PlanetPins/newPin');
}

module.exports.createNewPin = async (req, res) => {
    const pin = new PlanetPins(req.body.earthExplorer);
    pin.author = req.user._id;
    await pin.save();
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
    if(!pin){
        req.flash('error', 'can not find that planet pin!');
        return res.redirect('/earthExplorer');
    }
    res.render('./PlanetPins/details', { pin });
}

module.exports.editPin = async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    if(!pin){
        req.flash('error', 'can not find that planet pin!');
        return res.redirect(`/earthExplorer`);
    }
    res.render('./PlanetPins/edit', { pin });
}

module.exports.postEdit = async (req, res) => {
    const updatedPin = await PlanetPins.findByIdAndUpdate(req.params.id, { ...req.body.earthExplorer }, { runValidators: true });
    req.flash('success', 'successfully edited the planet pin!');
    res.redirect(`/earthExplorer/${updatedPin._id}`);
}

module.exports.deletePin = async (req, res) => {
    const deletePin = await PlanetPins.findByIdAndDelete(req.params.id);
    req.flash('warming', 'successfully deleted a planet pin!');
    res.redirect('/earthExplorer');
}