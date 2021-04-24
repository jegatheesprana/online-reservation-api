const bcrypt = require('bcryptjs');
const passport = require('passport');
const Joi = require('joi');

// User model
const User = require('../models/User');

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required()
});

// //Login Page
// router.get('/login', (req, res) => {
//     res.json('Login');
// });

// //Registger
// router.get('/register', (req, res) => {
//     res.json('register');
// });

// current user details
const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            status: 'success',
            loggedIn: true,
            user: {
                _id: req.user._doc._id,
                name: req.user._doc.name,
                email: req.user._doc.email,
            }
        })
    } else {
        res.status(401)
            .json({
                status: 'failed',
                loggedIn: false,
                user: {}
            })
    }
}

// Register handle
const register = (req, res) => {
    const { name, email, password } = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password) {
        errors.push({ msg: 'Please fill in all fields' });
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
}

// Login Handle
const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("No user exists")
        else {
            req.logIn(user, err => {
                if (err) throw err;
                res.json({
                    status: 'success',
                    loggedIn: true,
                    user: {
                        _id: req.user._doc._id,
                        name: req.user._doc.name,
                        email: req.user._doc.email,
                    }
                })
            })
        }
    })(req, res, next);
}

//message to be sent after login
const afterLogin = (req, res) => {
    res.json({
        status: 'success',
        loggedin: true,
        user: {
            _id: req.user._doc._id,
            name: req.user._doc.name,
            email: req.user._doc.email,
        }
    })
}

// Logout handler
const logout = (req, res) => {
    req.logout();
    res.json('Logged out')
}

module.exports = {
    getCurrentUser,
    register,
    login,
    afterLogin,
    logout
}