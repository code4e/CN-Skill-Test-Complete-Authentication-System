const express = require('express');
const passport = require('passport')
const router = express.Router();
let firstTimeLogin = false;

router.use('/users', require('./users'));


//render the auth page at the start
router.get('/',
    function (req, res, next) {
        passport.authenticate(
            "jwt",
            { session: false },
            function (err, user, info) {
                if (err) {
                    return res.status(401).json(err);
                }
                if (!user) {
                    res.render('user_auth_home', {
                        title: 'One Stop Auth',
                    });
                } else {
                    req.user = user;
                    next();
                }

            }
        )(req, res, next);
    },
    (req, res) => res.redirect('/users/protected')
);












module.exports = router;