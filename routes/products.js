const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')

router.get('/', productController.index);
router.get('/details', productController.details);
router.get('/productItems', productController.productItems);
router.post('/', productController.createPost);
router.get('/findOne/:id', productController.detail);
router.put('/:id', productController.updatePut);
router.delete('/productItem/:productId/:itemId', productController.deleteProductItem);
router.delete('/:id', productController.deleteProduct);

module.exports = router;