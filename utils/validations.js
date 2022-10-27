const ExpressError = require("./ExpressError");
const sanitizeHtml = require('sanitize-html');


//length 3 - 20 only contains alphanumeric and _ and .
const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/g
//length 8 - 25 , atleast one lowercase , one uppercase ,one number and  optional special characters
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,25}$/g
//checks for valid email address
const emailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi


// loops through the object and sanitizes html if input is a string
const sanitizeInputs = (obj)=>{
    for(let key in obj)
    {
        if(typeof obj[key] == 'string')
        {
            obj[key] = sanitizeHtml(obj[key]);
        }
    }
}

module.exports.validatePost = (req,res,next)=>{

    sanitizeInputs(req.body.post);
    console.log(req.body.post)

    if(!req.body.post){
        next(new ExpressError('Post cannot be empty',400));
    }

    if(typeof req.body.post.title != 'string' || req.body.post.title.length < 3 || req.body.post.title.length > 100){
        next(new ExpressError('Invalid title',400));
    }

    if(typeof req.body.post.description != 'string' || req.body.post.description.length < 3 || req.body.post.description.length > 350){
        next(new ExpressError('Invalid description',400));
    }

    if(typeof req.body.post.text != 'string' || req.body.post.text.length < 10){
        next(new ExpressError('Invalid body',400))
    }

    next();

}

module.exports.validateUserInput = (req,res,next)=>{
    console.log(req.body);
    if(typeof req.body.username != 'string' || !req.body.username.match(usernameRegex)){
        next(new ExpressError('Invalid username',400));
    }

    if(typeof req.body.password != 'string' || !req.body.password.match(passwordRegex)){
        next(new ExpressError('Invalid password',400));
    }
    if(typeof req.body.email != 'string' || !req.body.email.match(emailRegex)){
        next(new ExpressError('Invalid email',400));
    }

    next();
}