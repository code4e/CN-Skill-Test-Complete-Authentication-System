const express = require('express');
const app = express();
const PORT = 8000;
const bodyParser = require('body-parser');
const db = require('./config/mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const passportJWTStrategy = require('./config/passport-jwt-strategy');
//require passport google oauth2 stragegy for setting up google oauth login
const passportGoogleOAuth20 = require('./config/passport-google-oauth20-strategy');

const expressLayouts = require('express-ejs-layouts');
require('dotenv').config()




//express-session, used for flash messages
const session = require('express-session');


//connect flash for flash messages. Sending flash message when the user signs in in the locals with the session cookie, only for the first time and then clear it on subsequent requests
const flash = require('connect-flash');
const customFlashMWare = require('./config/flash-middleware');



//set up the view engine and set the views
app.set('view engine', 'ejs');
app.set('views', './views');

//use ejs layouts before rendering views to detect that layout is being used at the front end
app.use(expressLayouts);

// use ejs layout to apply styles to specific pages on top of layout styles by telling ejs that whenever it encounters a <link> tag place it in head and <script> tag at the last of body 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//initialise passport as a middleware to perform authentication before routing the request
app.use(passport.initialize());


//body parser to parse the data coming from body (e.g data from a form)
app.use(bodyParser.urlencoded({ extended: true }));

//use cookies to store the jwt token at the front end
app.use(cookieParser());
app.use(express.json());


// use static files middlleware and tell express where to look out for the static files
app.use(express.static('./assets'));

//use the session middleware
app.use(session({
    name: 'auth_develop',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (10000 * 60 * 100),
    },

}));

app.use(passport.session());


//use connect-flash MW after using session MW so that the session has already been estalibshed and cookies have been defined by the time we're sending out the flash message(s)
// this is because connect-flash uses session cookie to store the flash message(s)
app.use(flash());

app.use(customFlashMWare.setFlash);


app.use('/', require('./routes/index'));


app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));