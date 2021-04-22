"use strict";

var express = require('express');

var router = express.Router();

var bcrypt = require('bcryptjs');

var passport = require('passport');

var Joi = require('joi'); // User model


var User = require('../models/User');

var schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
  conPassword: Joi.string().min(6).required()
})["with"]('password', 'conPassword'); //Login Page

router.get('/login', function (req, res) {
  res.json('Login');
}); //Registger

router.get('/register', function (req, res) {
  res.json('register');
}); // current user details

router.get('/currentUser', function (req, res) {
  res.json();
}); // Register handle

router.post('/register', function (req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      email = _req$body.email,
      password = _req$body.password,
      conPassword = _req$body.conPassword;
  var errors = []; //check required fields

  if (!name || !email || !password || !conPassword) {
    errors.push({
      msg: 'Please fill in all fields'
    });
  } //check passwords  match


  if (password !== conPassword) {
    errors.push({
      msg: 'Passwords do not match'
    });
  } //check pass lenth


  if (password.lenth < 6) {
    errors.push({
      msg: 'Password should be at least 6 characters'
    });
  } // Using Joi for validation


  var _schema$validate = schema.validate(req.body),
      error = _schema$validate.error;

  if (error) errors.push({
    msg: error.details[0].message
  });

  if (errors.length > 0) {
    res.status(400).json(['Failed', errors]);
  } else {
    User.findOne({
      email: email
    }).then(function (user) {
      if (user) {
        errors.push({
          msg: "Email is already registerd"
        });
        res.status(400).json(['failed', errors]);
      } else {
        var newUser = new User({
          name: name,
          email: email,
          password: password
        }); // Hash password

        bcrypt.genSalt(10, function (err, salt) {
          return bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err; // set password to hashed

            newUser.password = hash; // Save user

            newUser.save().then(res.json('Registered'))["catch"](console.log);
          });
        }); //res.send(newUser)
      }
    });
  }
}); // Login Handle

router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successMessage: 'Logged in',
    failureMessage: 'Loggin in failed',
    successRedirect: '/success',
    failureRedirect: '/error'
  })(req, res, next);
}); // Logout handler

router.get('/logout', function (req, res) {
  req.logout();
  res.json('Logged out');
});
module.exports = router;