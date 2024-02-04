if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const planetPins = require('../models/PlanetPin');
const { places, descriptors, des } = require('./seedHelpers');
const cities = require('./cities');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

mongoose.connect('mongodb://127.0.0.1:27017/planetFB')
    .then(() => { console.log('connection opened!'); })
    .catch((e) => {
        console.log('error!');
        console.log(e);
    });


const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await planetPins.deleteMany({});
    for (let i = 0; i < 30; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 20) + 10;
        const place = sample(places);
        const descriptor = sample(descriptors);
        const location = `${cities[randomNum].city}, ${cities[randomNum].state}`;
        var geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1,
        }).send();
        var geometry = geoData.body.features[0].geometry;
        if(!geometry){
            geoData = await geocoder.forwardGeocode({
                query: cities[randomNum].state,
                limit: 1,
            }).send();
            geometry = geoData.body.features[0].geometry;
        }
        if(!geometry){
            geoData = await geocoder.forwardGeocode({
                query: cities[randomNum].city,
                limit: 1,
            }).send();
            geometry = geoData.body.features[0].geometry;
        }
        const pin = new planetPins({
            location: location,
            title: `${descriptor} ${place}`,
            images: (() => {
                const imagesArr = [];
                const numberOfImages = Math.floor(Math.random() * 4 + 1);
                for (let j = 0; j < numberOfImages; j++) {
                    imagesArr.push({
                        url: `https://source.unsplash.com/random/1600x900/?${descriptor} ${place}&${Math.floor(Math.random() * 100) + 1}`,
                        filename: `EarthFB/${uuidv4()}`,
                    });
                }
                return imagesArr;
            })(),
            description: des[Math.floor(Math.random() * (des.length - 1))],
            price: randomPrice,
            author: '65bc0ff5b871b1f0cf34d169',
            geometry: geometry,
        });
        await pin.save();
    }
}

seedDB().then(() => mongoose.connection.close())