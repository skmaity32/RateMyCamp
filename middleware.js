// middleware to check whether user logged in
module.exports.isLoggedIn = (req, res, next) => {
    // req.isAuthenticated(): returns true in case an authenticated user is present in req.session.passport.user
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to be Logged In or Signed Up first!');
        return res.redirect('/login');
    }
    next();
}