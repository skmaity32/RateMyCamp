const express = require('express');
// without mergeParams = true, we can't access id from req.params
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Review schema (Joi) for server side form validation
const { reviewSchemaForValidation } = require('../schemasForValidation');

// middleware to perform server side review form validation
const validateReview = (req, res, next) => {
    const { error } = reviewSchemaForValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Add a review
router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const newReview = await new Review(req.body.review);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Yay, Review has been saved successfully!');
    res.redirect(`/campgrounds/${id}`);
}))

// Delete a review
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // The $pull operator removes from an existing array all instances 
    // of a value or values that match a specified condition.
    await Campground.findByIdAndUpdate(id, { $pull : { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Yay, Review has been deleted successfully!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;