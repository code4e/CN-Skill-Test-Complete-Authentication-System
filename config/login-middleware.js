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
                console.log(res.locals.user);
                next()
            } else {
                res.status(400).json({
                    message: 'Incorrect username or password'
                })
            }
        } else {
            res.status(400).json({
                message: 'Incorrect username or password'
            })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}
