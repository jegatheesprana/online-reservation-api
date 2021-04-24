"use strict";

var bcrypt = require('bcryptjs');

var passport = require('passport');

var Joi = require('joi'); // User model


var User = require('../models/User');

var schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required()
}); // //Login Page
// router.get('/login', (req, res) => {
//     res.json('Login');
// });
// //Registger
// router.get('/register', (req, res) => {
//     res.json('register');
// });
// current user details

var getCurrentUser = function getCurrentUser(req, res) {
  if (req.isAuthenticated()) {
    res.json({
      status: 'success',
      loggedIn: true,
      user: {
        _id: req.user._doc._id,
        name: req.user._doc.name,
        email: req.user._doc.email
      }
    });
  } else {
    res.status(401).json({
      status: 'failed',
      loggedIn: false,
      user: {}
    });
  }
}; // Register handle


var register = function register(req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      email = _req$body.email,
      password = _req$body.password;
  var errors = []; //check required fields

  if (!name || !email || !password) {
    errors.push({
      msg: 'Please fill in all fields'
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
}; // Login Handle


var login = function login(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) throw err;
    if (!user) res.send("No user exists");else {
      req.logIn(user, function (err) {
        if (err) throw err;
        res.json({
          status: 'success',
          loggedIn: true,
          user: {
            _id: req.user._doc._id,
            name: req.user._doc.name,
            email: req.user._doc.email
          }
        });
      });
    }
  })(req, res, next);
}; //message to be sent after login


var afterLogin = function afterLogin(req, res) {
  res.json({
    status: 'success',
    loggedin: true,
    user: {
      _id: req.user._doc._id,
      name: req.user._doc.name,
      email: req.user._doc.email
    }
  });
}; // Logout handler


var logout = function logout(req, res) {
  req.logout();
  res.json('Logged out');
};

module.exports = {
  getCurrentUser: getCurrentUser,
  register: register,
  login: login,
  afterLogin: afterLogin,
  logout: logout
};