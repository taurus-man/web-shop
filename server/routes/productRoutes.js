const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const requireLogin = require('../middleware/requireLogin');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', requireLogin, requireAdmin, productController.createProduct);
router.put('/:id', requireLogin, requireAdmin, productController.updateProduct);
router.delete('/:id', requireLogin, requireAdmin, productController.deleteProduct);

module.exports = router;


