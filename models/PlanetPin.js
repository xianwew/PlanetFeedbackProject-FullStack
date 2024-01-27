const mongoose = require('mongoose');

const planetPinSchema = new mongoose.Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('planetpins', planetPinSchema);