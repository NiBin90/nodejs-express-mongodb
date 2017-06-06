const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports = function () {

    passport.use(new LocalStrategy(function (username, password, done) {
        //Match PassWord
        let query = { username: username };
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'No user found!' });
            }

            //Match PassWord
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user);
        });
    });
}