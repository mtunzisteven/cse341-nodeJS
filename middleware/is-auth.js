module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn){ // send user to login if not logged in
        return res.redirect('/login');
    }
    next();
};