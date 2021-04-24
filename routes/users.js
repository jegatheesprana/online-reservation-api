const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Login Page
router.get('/login', (req, res) => {
    res.json('Login');
});

//Registger
router.get('/register', (req, res) => {
    res.json('register');
});

router.get('/currentUser', userController.getCurrentUser)
router.post('/register', userController.register)
router.post('/login', userController.login, userController.afterLogin);
router.get('/logout', userController.logout);

module.exports = router;