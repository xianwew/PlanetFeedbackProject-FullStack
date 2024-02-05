const mongoose = require('mongoose');
const Review = require('./review');

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String,
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const planetPinSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    date: String,
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
}, opts);

planetPinSchema.virtual('properties.popUpMarkup').get(function () {
    return (
        `<div style="padding: 2px; padding-Right: 1.3rem">
            <a href="/earthExplorer/${this._id}" style="font-Weight: 550; font-Size: 1.2rem;">${this.title}</a>
            <p style="font-Size: 14px; margin-top: 5px" class="mb-0">${this.location}</P>
        </div>`
    );
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