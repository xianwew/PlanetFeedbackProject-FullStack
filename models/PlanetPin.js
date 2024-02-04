const mongoose = require('mongoose');
const Review = require('./review');

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String,
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const planetPinSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
});

planetPinSchema.post('findOneAndDelete', async (pin) => {
    if (pin) {
        await Review.deleteMany({
            _id: {
                $in: pin.reviews,
            }
        });
    }
});

module.exports = mongoose.model('planetpins', planetPinSchema);