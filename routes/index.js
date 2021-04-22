const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/companies', require('./companies'));
router.use('/invoice', require('./invoice'));
router.use('/branches', require('./branches'));
router.use('/rooms', require('./rooms'));

router.get('/', ensureAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;