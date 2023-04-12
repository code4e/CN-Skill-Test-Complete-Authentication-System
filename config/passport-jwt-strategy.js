// The JWT Strategy is what allows us to secure routes with cookie-based token.


const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
require('dotenv').config()



const secret = process.env.TOKEN_SECRET;

const cookieExtractor = req => {
    let jwt = null

    if (req && req.cookies) {
        jwt = req.cookies['jwt']
    }

    return jwt
}

passport.use('jwt', new JWTStrategy({

    // where we want to get our JWT from
    jwtFromRequest: cookieExtractor,

    secretOrKey: secret
}, (jwtPayload, done) => {
    const { expiration } = jwtPayload

    if (Date.now() > expiration) {
        done('Unauthorized. Please login to view the home page', false);
    }

    done(null, jwtPayload)
}));


module.exports = passport;