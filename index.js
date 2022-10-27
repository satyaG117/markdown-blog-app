const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

const ExpressError = require('./utils/ExpressError');

const app = express();

const PORT = 3000;

const MONGO_URI = 'mongodb://localhost:27017/blog-app';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//set ejs engine to ejs-mate
app.engine('ejs', ejsMate);

//serve static files from public directory
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//override method to use put/patch/delete requests
app.use(methodOverride('_method'));


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    
];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            // connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ /*"'unsafe-inline'"*/, "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                
            ],
            childSrc   : [ "blob:" ]
        }
    })
);


//replace $ and . from user inputs which can cause NO-SQL injections
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

const sessionConfig = {
    name: 'sess',
    secret: 'key_to_sign_cookie',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    }
}

app.use(session(sessionConfig));

app.use(flash());


app.use((req, res, next) => {
    //used to show or hide login and logout button
    if(req.session.user_id)
    {
        res.locals.currentUser = req.session.user_id;
        res.locals.username = req.session.user_name;
    }
    else{
        res.locals.currentUser = null;
        res.locals.username = null;

    }

    //setting flash messages on response
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
})



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URI);

    // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

app.use('/posts', postRoutes);
app.use('/', userRoutes);

// if no match URL match found then throw error
app.all('*',(req,res,next)=>{
    next(new ExpressError("Not found",404));
})

// error handler
app.use((err,req,res,next)=>{
    if(!err.message){
        err.message = "Something went wrong";
        err.statusCode = 500;
    }
    res.render('error.ejs',{err});
})


app.listen(PORT, () => {
    console.log('Server running on ', PORT);
})