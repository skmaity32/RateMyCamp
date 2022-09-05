// campground & review schema (Joi) for server side form validation
const { campgroundSchemaForValidation, reviewSchemaForValidation } = require('./schemasForValidation');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

// middleware to check whether user logged in
module.exports.isLoggedIn = (req, res, next) => {
    // req.isAuthenticated(): returns true in case an authenticated user is present in req.session.passport.user
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to be Logged In or Signed Up first!');
        return res.redirect('/login');
    }
    next();
}

// middleware to check whether the current user is the author of the campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You can not modify a campground that is not yours!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// middleware to check whether the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You can not delete a review that is not yours!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// middleware to perform server side campground form validation
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchemaForValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// middleware to perform server side review form validation
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchemaForValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}