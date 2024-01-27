const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const PlanetPins = require('./models/PlanetPin');
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/planetFB')
    .then(() => { console.log('connection opened!'); })
    .catch((e) => {
        console.log('error!');
        console.log(e);
    });

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.send('It is working!');
});

app.get('/earthlyExplorer', async (req, res) => {
    const pins = await PlanetPins.find({});
    res.render('PlanetPins/index', {pins});
});

app.get('/earthlyExplorer/newPin', (req, res) => {
    res.render('PlanetPins/newPin');
});

app.post('/earthlyExplorer', async (req, res) => {
    const pin = new PlanetPins(req.body.earthlyExplorer);
    await pin.save();
    res.redirect(`earthlyExplorer/${pin._id}`);
});

app.get('/earthlyExplorer/:id', async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    res.render('PlanetPins/details', {pin});
});

app.get('/earthlyExplorer/:id/edit', async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    res.render('PlanetPins/edit', {pin});
});

app.put('/earthlyExplorer/:id', async (req, res) => {
    const updatedPin = await PlanetPins.findByIdAndUpdate(req.params.id, {...req.body.earthlyExplorer}, {runValidators: true});
    res.redirect(`/earthlyExplorer/${updatedPin._id}`);
});

app.delete('/earthlyExplorer/:id', async (req, res) => {
    const deletePin = await PlanetPins.findByIdAndDelete(req.params.id);
    res.redirect('/earthlyExplorer');
});

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});