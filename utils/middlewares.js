const User = require("../models/user");
const ExpressError = require("./ExpressError");

module.exports.isLoggedIn = async (req, res, next) => {
    if (!req.session.user_id) {
        //redirection URL after successful login
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Need to log in');
        return res.redirect('/login');
    }
    next();
}

//checks if the currently logged in user is the author of a post
module.exports.isAuthor = (Model) => {
    return async (req, res, next) => {
        const { id } = req.params;
        const data = await Model.findById(id);
        if (!data) {
            
            next(new ExpressError('Something went wrong', 500));
        }
        if (req.session.user_id && data.author.equals(req.session.user_id)) {
            res.data = data;
            next();
        }
        else {
            next(new ExpressError('Unauthorized Access', 401));
        }
    }
}

module.exports.doesUserExists = async (req, res, next) => {
    let user = await User.findOne({ username: req.body.username });
    if (user) {
        req.flash('info', 'Username already taken');
        return res.redirect('/register');
    }
    next();
}



