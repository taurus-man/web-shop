const db = require('../db');

class CartItem {
    static async addToCart({ userId, productId, quantity = 1 }) {
        const [existing] = await db.query("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?", [userId, productId]);
        if (existing.length > 0) {
            const newQuantity = existing[0].quantity + quantity;
            await db.query("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?", [newQuantity, userId, productId]);
            return { userId, productId, quantity: newQuantity };
        } else {
            await db.query("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)", [userId, productId, quantity]);
            return { userId, productId, quantity };
        }
    }

    static async getCartItems(userId) {
        const [items] = await db.query("SELECT * FROM cart_items WHERE user_id = ?", [userId]);
        return items;
    }

    static async updateCartItem(userId, productId, quantity) {
        await db.query("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?", [quantity, userId, productId]);
        return { userId, productId, quantity };
    }

    static async removeCartItem(userId, productId) {
        const [res] = await db.query("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", [userId, productId]);
        if (res.affectedRows === 0) {
            throw new Error('Cart not found');
        }
    }

}

module.exports = CartItem;
