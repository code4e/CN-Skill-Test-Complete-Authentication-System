const express = require('express');
const app = express();
const PORT = 8000;
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const db = require('./config/mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const passportJWTStrategy = require('./config/passport-jwt-strategy');




// //use ejs layouts before rendering views to detect that layout is being used at the front end
// app.use(expressLayouts);

// // use ejs layout to apply styles to specific pages on top of layout styles by telling ejs that whenever it encounters a <link> tag place it in head and <script> tag at the last of body 
// app.set('layout extractStyles', true);
// app.set('layout extractScripts', true);


//set up the view engine and set the views
app.set('view engine', 'ejs');
app.set('views', './views');


//initialise passport as a middleware to perform authentication before routing the request
app.use(passport.initialize());


//body parser to parse the data coming from body (e.g data from a form)
app.use(bodyParser.urlencoded({ extended: true }));

//use cookies to store the jwt token at the front end
app.use(cookieParser());
app.use(express.json());


// use static files middlleware and tell express where to look out for the static files
app.use(express.static('./assets'));





app.use('/', require('./routes/index'));


app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));