const mongoose = require('mongoose');
const planetPins = require('../models/PlanetPin');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');
const des = ["Nestled in the heart of lush, emerald forests, this enchanting waterfall cascades gracefully, creating a serene oasis of natural wonder.",
    "A symphony of colors and fragrances, the vibrant botanical gardens transport visitors to a paradise of rare and exotic blooms.",
    "Perched atop a craggy cliff, the ancient castle's weathered stones whisper tales of bygone eras, offering breathtaking panoramic views of the surrounding countryside.",
    "With its cobblestone streets, charming cafes, and centuries-old architecture, this historic village is a picturesque time capsule where every corner tells a story.",
    "Sunset hues dance on the tranquil waters of the serene lake, casting a golden spell on all who come to witness nature's nightly spectacle.",
    "Wander through the aromatic fields of lavender, where a sea of purple blooms stretches to the horizon, creating a fragrant, soothing haven.",
    "The bustling marketplace is a kaleidoscope of sights and sounds, where artisans craft their wares, and the aroma of exotic spices fills the air.",
    "The ancient ruins, cloaked in moss and mystery, stand as a testament to the passage of time, inviting curious souls to explore their timeless secrets.",
    "Towering granite peaks pierce the heavens, their snow-capped summits glistening in the crisp mountain air, a playground for adventurers.",
    "Underneath the starlit sky, the tranquil beach unveils its own magic, where the gentle lullaby of waves serenades those who seek solace by the sea."];

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
    for (let i = 0; i < 200; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 20) + 10;
        const place = sample(places);
        const descriptor = sample(descriptors);
        const pin = new planetPins({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${descriptor} ${place}`,
            image: `https://source.unsplash.com/random/1600x900/?${descriptor} ${place}`,
            description: des[Math.floor(Math.random() * (des.length - 1))],
            price: randomPrice,
        });
        await pin.save();
    }
}

seedDB().then(() => mongoose.connection.close())