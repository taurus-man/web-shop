const express = require('express');
const cartController = require('../controllers/cartController');
const requireLogin = require('../middleware/requireLogin');
const router = express.Router();

router.post('/add', requireLogin, cartController.addItemToCart);
router.get('/', requireLogin, cartController.getCartItems);
router.put('/update', requireLogin, cartController.updateCartItem);
router.delete('/remove', requireLogin, cartController.removeCartItem);

module.exports = router;
