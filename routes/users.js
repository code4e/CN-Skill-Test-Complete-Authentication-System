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
    (req, res) => res.render('home', { username: req.user.username })
)




module.exports = router;