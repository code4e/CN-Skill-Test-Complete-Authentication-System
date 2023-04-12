const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const crypto = require('crypto');
require('dotenv').config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let userObj = {
                username: profile.displayName,
                email: profile.emails[0].value,
                password: profile.id
            }
            //after confirmation of sign in from google, finding if the user exists or not in our database
            let user = await User.findOne({ email: profile.emails[0].value });
            //if user exists, then sign in and set user as req.user
            if (user) {
                return done(null, user);
            } else {
                //user does not exist in our db yet, so we sign him up i.e. create the user in db and set him as req.user
                let user = await User.create(userObj);
            }

        } catch (error) {
            console.log('error in creating in the user in db google oauth20 strategy 2');
            return;

        }
    }
));

passport.serializeUser((user, cb) => cb(null, user));

passport.deserializeUser((user, cb) => cb(null, user));


module.exports = passport;
