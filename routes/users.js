const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const passport = require('passport');
const loginMiddleware = require('../config/login-middleware');

//create the user on sucessful sign up
router.post('/create', usersController.create);

//login the user after authentication via loginMiddleware
router.post('/create-session', loginMiddleware, usersController.createSession);

//logout the user
router.get('/destroy-session', usersController.destroy);

//allow logged in user to access the protected route i.e. the home page. If the user is not logged, redirect them to the auth page
router.get('/protected',
    passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
    (req, res) => res.render('home', { user: req.user })
)

router.get('/update-password-form',
    passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
    function (req, res) {
        return res.render('update_password_form', {
            user: req.user
        });
    });

router.post('/update-password',
    passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
    usersController.updatePassword
)


router.get('/forgot-password',
    function (req, res, next) {
        passport.authenticate(
            "jwt",
            { session: false },
            function (err, user, info) {
                // if (err) {
                //     return res.status(401).json(err);
                // }
                if (err || !user) {
                    return res.render('forgot_password', {
                        title: 'One Stop Auth',
                    });
                } else {
                    req.user = user;
                    next();
                }

            }
        )(req, res, next);
    },
    (req, res) => {
        return res.redirect('/');
    }
);



router.post('/change-password', usersController.forgotPassword);


router.get('/change-password/:id/:token', usersController.resetPasswordForm);



router.post('/change-password-link/:id/:token', usersController.setNewPassword);


//first make the request to google auth for signing in/ up the user
router.get('/auth/google',
    passport.authenticate('google',
        { scope: ['profile', 'email'] }));

//after the user has been signed in, receieve back the request from the callback url sent by google with user info and handle success and failure accordingly
router.get('/auth/google/callback',
    function (req, res, next) {
        passport.authenticate(
            "google",
            { failureRedirect: '/auth/google/failure' },
            function (err, user, info) {
                if (err || !user) {
                    return res.redirect('back');
                } else {
                    res.locals.user = user;
                    next();
                }
            }

        )(req, res, next);
    },
    usersController.createSession
);






module.exports = router;