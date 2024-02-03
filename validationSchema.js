const Joi = require('joi');

const pinSchema = Joi.object({
    earthExplorer: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
        // author: Joi.string().length(24).hex().required(),
    }).required(),
    deleteImages: Joi.array(),
});

module.exports.pinSchema = pinSchema;

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
        // author: Joi.string().length(24).hex().required(),
    }).required(),
});

module.exports.reviewSchema = reviewSchema;

