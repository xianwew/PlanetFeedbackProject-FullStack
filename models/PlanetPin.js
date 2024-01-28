const mongoose = require('mongoose');

const planetPinSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
});

module.exports = mongoose.model('planetpins', planetPinSchema);