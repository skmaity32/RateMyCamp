const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground} = require('../middleware');

const Campground = require('../models/campground');

// Show all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// Render form to add a new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

// Add a campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Yay, Campground has been saved successfully!');
    res.redirect('/campgrounds');
}))

// Show a particular campground
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Sorry, could not find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

// Render form to edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Sorry, could not find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

// Edit a Campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Yay, Campground has been updated successfully!');
    res.redirect(`/campgrounds/${id}`);
}))

// Delete a Campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Yay, Campground has been deleted successfully!');
    res.redirect(`/campgrounds`);
}))

module.exports = router;