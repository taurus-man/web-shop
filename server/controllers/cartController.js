const CartItem = require('../models/CartItem');

exports.addItemToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        const item = await CartItem.addToCart({ userId, productId, quantity });
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
        const { productId, quantity } = req.body;
        const item = await CartItem.updateCartItem(userId, productId, quantity);
        res.json(item);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while updating cart item." });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        await CartItem.removeCartItem(userId, productId);
        res.send({ message: "Item removed from cart successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while removing cart item." });
    }
};
