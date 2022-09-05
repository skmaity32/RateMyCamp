const express = require('express');
// without mergeParams = true, we can't access id from req.params
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const Campground = require('../models/campground');
const Review = require('../models/review');

// Add a review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const newReview = await new Review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Yay, Review has been saved successfully!');
    res.redirect(`/campgrounds/${id}`);
}))

// Delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // The $pull operator removes from an existing array all instances 
    // of a value or values that match a specified condition.
    await Campground.findByIdAndUpdate(id, { $pull : { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Yay, Review has been deleted successfully!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;