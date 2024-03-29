if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const planetPins = require('../models/PlanetPin');
const { places, descriptors, des } = require('./seedHelpers');
const cities = require('./cities');
const dbUrl = process.env.DB_URL;
console.log(dbUrl);

mongoose.connect(dbUrl)
    .then(() => { console.log('connection opened!'); })
    .catch((e) => {
        console.log('error!');
        console.log(e);
    });

const getFormattedDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
    const year = currentDate.getFullYear().toString().slice(-2); 
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
}

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await planetPins.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const randomNum = Math.floor(Math.random() * cities.length);
        const randomPrice = Math.floor(Math.random() * 20) + 10;
        const place = sample(places);
        const descriptor = sample(descriptors);
        const location = `${cities[randomNum].city}, ${cities[randomNum].state}`;
        const pin = new planetPins({
            location: location,
            title: `${descriptor} ${place}`,
            date: getFormattedDate(),
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
            author: '65c0755f6959cb78538f6fd9',
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[randomNum].longitude,
                    cities[randomNum].latitude,
                ],
            },
        });
        await pin.save();
    }
}

seedDB().then(() => mongoose.connection.close())