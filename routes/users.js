const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Joi = require('joi');

// User model
const User = require('../models/User');

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    conPassword: Joi.string().min(6).required()
})
    .with('password', 'conPassword');

//Login Page
router.get('/login', (req, res) => {
    res.json('Login');
});

//Registger
router.get('/register', (req, res) => {
    res.json('register');
});

// current user details
router.get('/currentUser', (req, res) => {
    res.json()
})

// Register handle
router.post('/register', (req, res) => {
    const { name, email, password, conPassword } = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !conPassword) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    //check passwords  match
    if (password !== conPassword) {
        errors.push({ msg: 'Passwords do not match' });
    }
    //check pass lenth
    if (password.lenth < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }
    // Using Joi for validation
    const { error } = schema.validate(req.body);
    if (error) errors.push({ msg: error.details[0].message });

    if (errors.length > 0) {
        res.status(400).json(['Failed', errors]);
    } else {
        User.findOne({ email })
            .then(user => {
                if (user) {
                    errors.push({ msg: "Email is already registerd" })
                    res.status(400).json(['failed', errors]);
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // set password to hashed
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                            .then(res.json('Registered'))
                            .catch(console.log);
                    }));
                    //res.send(newUser)
                }
            });
    }
})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successMessage: 'Logged in',
        failureMessage: 'Loggin in failed',
        successRedirect: '/success',
        failureRedirect: '/error'
    })(req, res, next);
});

// Logout handler
router.get('/logout', (req, res) => {
    req.logout();
    res.json('Logged out')
});

module.exports = router;