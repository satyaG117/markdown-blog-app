const bcrypt = require('bcrypt');
const User = require('../models/user');

const SALT_ROUNDS = 11;

module.exports.renderLoginForm = (req,res,next)=>{
    res.render('users/login.ejs');
}

module.exports.renderRegisterForm = (req,res,next)=>{
    res.render('users/register.ejs');
}

module.exports.loginUser = async(req,res,next)=>{
    console.log(req.body);
    const user = await User.findOne({username : req.body.username});
    // if user doesn't exist
    if(!user){
        req.flash("error","Invalid credentials");
    }
    else{

        const result = await bcrypt.compare(req.body.password , user.password);
        if(result){
            // if successful login then redirect to previous URL
            req.session.user_id = user._id;
            req.session.user_name = user.username;
            req.flash('success',`Logged in as : ${user.username}`);
            // if no redirect URL present then redirect to /posts by default
            const redirectUrl = req.session.returnTo || '/posts';
            delete req.session.returnTo;
            return res.redirect(redirectUrl);
        }
        else{
            req.flash('error','Invalid credentials');
        }
    }
    res.redirect('/login');
}

module.exports.registerUser = async(req,res,next)=>{
    const hashedPW =  await bcrypt.hash(req.body.password , SALT_ROUNDS);
    const user = new User({username : req.body.username , email : req.body.email , password : hashedPW});
    await user.save();
    req.flash('success','Account created successfully')
    res.redirect('/login');
}

module.exports.logoutUser = (req,res,next)=>{
    delete req.session.user_id;
    delete req.session.user_name;
    req.flash('success','logged out sucessfully');
    res.redirect('/posts');
}


