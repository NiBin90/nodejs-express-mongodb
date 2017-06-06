const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Bring in User Model
let User = require('../models/user');

//Register Form
router.get('/register', (req, res) => {
    res.render('register');
});

//Register Process
//Post Arcticle to the db
router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Title is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email is not valid').isEmail();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'password2 is required').equals(req.body.password);

    //Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save((err) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'You are now register!');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

//Login Process
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success', 'You are now logout');
    res.redirect('/users/login');
});
module.exports = router;