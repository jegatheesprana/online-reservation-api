const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.get('/', companyController.get_companies);
router.post('/', companyController.create_company);

module.exports = router;