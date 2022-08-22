const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Campground schema (Joi) for server side form validation
const { campgroundSchemaForValidation } = require('../schemasForValidation');

// middleware to perform server side campground form validation
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchemaForValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Show all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// Add a campground
router.post('/', validateCampground, catchAsync(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'Yay, Campground has been saved successfully!');
    res.redirect('/campgrounds');
}))

// Render form to add a new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

// Show a particular campground
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Sorry, could not find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

// Render form to edit a campground
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Sorry, could not find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

// Edit a Campground
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Yay, Campground has been updated successfully!');
    res.redirect(`/campgrounds/${id}`);
}))

// Delete a Campground
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Yay, Campground has been deleted successfully!');
    res.redirect(`/campgrounds`);
}))

module.exports = router;