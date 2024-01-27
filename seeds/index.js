const mongoose = require('mongoose');
const planetPins = require('../models/PlanetPin');
const {places, descriptors} = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://127.0.0.1:27017/planetFB')
    .then(() => { console.log('connection opened!'); })
    .catch((e) => {
        console.log('error!');
        console.log(e);
    });


const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async() => {
    await planetPins.deleteMany({});
    for(let i = 0; i < 50; i++){
        const randomNum = Math.floor(Math.random() * 1000);
        const camp = new planetPins({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
}

seedDB().then(() => mongoose.connection.close())