"use strict";

var express = require('express');

var router = express.Router();

var userController = require('../controllers/userController'); //Login Page


router.get('/login', function (req, res) {
  res.json('Login');
}); //Registger

router.get('/register', function (req, res) {
  res.json('register');
});
router.get('/currentUser', userController.getCurrentUser);
router.post('/register', userController.register);
router.post('/login', userController.login, userController.afterLogin);
router.get('/logout', userController.logout);
module.exports = router;