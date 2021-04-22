const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController')

router.get('/', invoiceController.getProducts);
router.get('/products', invoiceController.getProducts);

module.exports = router;