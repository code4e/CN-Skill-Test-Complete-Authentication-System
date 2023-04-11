const User = require('../models/user');

//to encrypt the passwords
const bcrypt = require('bcrypt');

require('dotenv').config()


const saltRounds = 10;
const jwt = require('jsonwebtoken');
const PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET;

const expirationtimeInMs = 60000000;

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
        return res.status(400).json({
            error: 'user not found'
        })
    }

    const payload = {
        username: user.username,
        email: user.email,
        id: user.id,
        expiration: Date.now() + parseInt(expirationtimeInMs)
    }

    const token = jwt.sign(JSON.stringify(payload), process.env.TOKEN_SECRET)

    res.cookie('jwt',
        token, {
        httpOnly: true,
        secure: false //--> SET TO TRUE ON PRODUCTION
    });

    req.flash('success', `Logged in Successully! Welcome ${user.username}`);

    return res.redirect('/users/protected');

}

module.exports.destroy = (req, res) => {
    if (req.cookies['jwt']) {
        req.flash('success', 'You have logged out successfully!');
        res.clearCookie('jwt')
        res.redirect('/');
    } else {
        res.status(401).json({
            error: 'Invalid jwt'
        })
    }
}

module.exports.updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
        req.flash('error', 'You cannot keep the same password. Please provide a different new password');
        return res.redirect('back');
    } else {
        try {
            const user = await User.findById(req.user.id);
            if (user) {
                //update the password

                //check if the old password is correct or not
                let match = await bcrypt.compare(oldPassword, user.password);
                if (match) {
                    //update the password
                    bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
                        // Store hash in your password DB.
                        user.password = hash;
                        user.save();
                        req.flash('success', 'Password changed sucessfully');
                        return res.redirect('back');

                    });
                } else {
                    req.flash('error', 'The old password is not correct. Please try again.');
                    return res.redirect('back');
                }
            } else {
                req.flash('error', 'Error in finding the user');
            }
        } catch (error) {

        }
    }
}


module.exports.forgotPassword = async (req, res) => {
    //fetch out the email entered and send the password reset email to it
    const { email } = req.body;

    try {
        //check if the user even exists in the database or not.
        let user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Oops! this email is not registered');
            return res.redirect('back');
        }


        //if the user exists, then create a one time unique password reset link which is valid for 15 minutes

        //this secret would only work once because it uses the previous password to formulate the passwor reset link. And if 
        //the password has been changed, the secret would no longer be able to be decrypted
        const secret = PASSWORD_RESET_SECRET + user.password;
        const payload = {
            id: user.id,
            email: user.email
        };


        const token = jwt.sign(payload, secret, { expiresIn: '15m' });

        console.log(token);


        //generate the link
        const link = `http://localhost:8000/users/change-password/${user.id}/${token}`;

        //TODO - send the email to the user here.
        console.log(link);



        return res.send(`<h2>Password reset email has been sent to ${user.email}. Please check your inbox....</h2>`);

    } catch (error) {
        req.flash('error', 'Oops! something went wrong. Please try again');
        return res.redirect('back');
    }

}


module.exports.resetPasswordForm = async (req, res) => {
    const { id, token } = req.params;

    try {
        //check if this id exists in the db
        let user = await User.findById(id);
        if (!user) {
            req.flash('error', 'Invalid Id');
            return res.redirect('back');
        }

        //we have a valid id and we also have a valid user with this id
        const secret = PASSWORD_RESET_SECRET + user.password;

        //if the payload is successfully decypted back from the token, then we can proceed further.
        const payload = jwt.verify(token, secret);
        return res.render('reset_password_form', {
            email: user.email,
            id,
            token
        });


    } catch (error) {
        return res.send(error.message);
    }

}

module.exports.setNewPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { id, token } = req.params;
    try {
        //check if the user with this id exists in the db
        let user = await User.findById(id);
        if (!user) {
            req.flash('error', 'Invalid Id');
            return res.redirect('back');
        }

        //validate that the password and confirmPassword match
        if (password !== confirmPassword) {
            req.flash('error', 'Password do not match');
            return res.redirect('/');
        }

        //now update the password after hashing it
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            // Store hash in your password DB.
            user.password = hash;
            user.save();
            req.flash('success', 'Password reset successull. Please login to continue');
            return res.redirect('/');
        });

    } catch (error) {
        return res.send(error.message);
    }


}
