const CartItem = require('../models/CartItem');

exports.addItemToCart = async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        const userId = req.user.id;

        const item = await CartItem.addToCart({ userId, product_id, quantity });
        res.json(item);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while adding to cart." });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await CartItem.getCartItems(userId);
        res.json(items);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving cart items." });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;
        const item = await CartItem.updateCartItem(userId, product_id, quantity);
        res.json(item);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while updating cart item." });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;
        await CartItem.removeCartItem(userId, product_id);
        res.send({ message: "Item removed from cart successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while removing cart item." });
    }
};
