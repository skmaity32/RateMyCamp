const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Routes
const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');

// Connecting to the database
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const app = express();

// Configurations
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}

// Creates a session with the above options
app.use(session(sessionConfig));
app.use(flash());

// For persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

/**
 * authenticate(): Generates a function that is used in Passport's LocalStrategy
 * serializeUser(): Generates a function that is used by Passport to serialize users into the session
 * deserializeUser(): Generates a function that is used by Passport to deserialize users into the session
 * 
 * All 3 are static methods, coming from passport-local-mongoose package
 * Static methods are exposed on the model constructor.
 */
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set res.locals variables to access them in templates rendered with res.render
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Using Routers with apt prefix
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Render Home page
app.get('/', (req, res) => {
    res.render('home');
})

// Handles unwanted routes
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found :(', 404));
})

// Error handler middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong :(';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('App is listening on PORT 3000!');
})