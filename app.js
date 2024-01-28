const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const PlanetPins = require('./models/PlanetPin');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://127.0.0.1:27017/planetFB')
    .then(() => { console.log('connection opened!'); })
    .catch((e) => {
        console.log('error!');
        console.log(e);
    });

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.send('It is working!');
});

app.get('/earthExplorer', async (req, res) => {
    const pins = await PlanetPins.find({});
    res.render('PlanetPins/index', {pins});
});

app.get('/earthExplorer/newPin', (req, res) => {
    res.render('PlanetPins/newPin');
});

app.post('/earthExplorer', async (req, res) => {
    const pin = new PlanetPins(req.body.earthExplorer);
    await pin.save();
    res.redirect(`earthExplorer/${pin._id}`);
});

app.get('/earthExplorer/:id', async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    res.render('PlanetPins/details', {pin});
});

app.get('/earthExplorer/:id/edit', async (req, res) => {
    const pin = await PlanetPins.findById(req.params.id);
    res.render('PlanetPins/edit', {pin});
});

app.put('/earthExplorer/:id', async (req, res) => {
    const updatedPin = await PlanetPins.findByIdAndUpdate(req.params.id, {...req.body.earthExplorer}, {runValidators: true});
    res.redirect(`/earthExplorer/${updatedPin._id}`);
});

app.delete('/earthExplorer/:id', async (req, res) => {
    const deletePin = await PlanetPins.findByIdAndDelete(req.params.id);
    res.redirect('/earthExplorer');
});

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});