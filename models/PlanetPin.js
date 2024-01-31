const mongoose = require('mongoose');
const Review = require('./review');

const planetPinSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
});

planetPinSchema.post('findOneAndDelete', async (pin) => {
    if(pin){
        await Review.deleteMany({
            _id: {
                $in: pin.reviews,
            }
        });
    }
});

module.exports = mongoose.model('planetpins', planetPinSchema);