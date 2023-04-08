const User = require('../models/user');

//to encrypt the passwords
const bcrypt = require('bcrypt');


const saltRounds = 10;
const jwt = require('jsonwebtoken');


const expirationtimeInMs = 6000000;


//sign up the new user i.e. store them in the database
module.exports.create = async (req, res) => {
    const { username, password, email, confirmPassword } = req.body;

    //perform basic validations
    if (!password || !confirmPassword || (password !== confirmPassword)) {
        return res.status(401).json({
            message: "Passwords do not match"
        });
    } else {
        try {
            //find if the user already exists in the db
            let user = await User.findOne({ email });
            if (user) {
                return res.status(409).json({
                    message: "Conflict! This user already exists"
                });
            } else {
                //encrypt the password and store it in the db
                bcrypt.hash(password, saltRounds, async function (err, hash) {
                    // Store hash in your password DB.
                    let user = await User.create({ username, password: hash, email });
                    return res.status(200).json({
                        message: "Sign up sucessfull. Please login to continue",
                        data: { username }
                    });
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error. Failed to sign up the user"
            });
        }
    }
}


module.exports.createSession = async (req, res) => {
    let user

    if (res.locals.user) {
        user = res.locals.user
    } else {
        res.status(400).json({
            error: 'user not found'
        })
    }

    const payload = {
        username: user.username,
        expiration: Date.now() + parseInt(expirationtimeInMs)
    }

    const token = jwt.sign(JSON.stringify(payload), 'auth_develop')

    res.cookie('jwt',
        token, {
        httpOnly: true,
        secure: false //--> SET TO TRUE ON PRODUCTION
    });

    return res.redirect('/users/protected');

}

module.exports.destroy = (req, res) => {
    if (req.cookies['jwt']) {
        res.clearCookie('jwt')
        res.redirect('/');
    } else {
        res.status(401).json({
            error: 'Invalid jwt'
        })
    }
}
