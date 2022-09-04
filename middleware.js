module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to be Logged In or Signed Up first!');
        return res.redirect('/login');
    }
    next();
}