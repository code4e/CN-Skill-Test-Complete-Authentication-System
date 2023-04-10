const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = loginMiddleware = async (req, res, next) => {
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email });

        //user found
        if (email === user.email) {

            //check if the passwords match
            //decrypt the password before comparing
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                res.locals.user = user
                next();
            } else {
                req.flash('error', 'Invalid username/password! Please try again');
                return res.redirect('/');
            }
        } else {
            req.flash('error', 'Error in finding the user');
            return res.redirect('/');
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}
