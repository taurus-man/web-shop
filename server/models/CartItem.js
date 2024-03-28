const db = require('../db');

class CartItem {
    static async addToCart({ userId, product_id, quantity = 1 }) {
        const [existing] = await db.query("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?", [userId, product_id]);
        if (existing.length > 0) {
            const newQuantity = existing[0].quantity + quantity;
            await db.query("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?", [newQuantity, userId, product_id]);
            return { userId, product_id, quantity: newQuantity };
        } else {
            await db.query("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)", [userId, product_id, quantity]);
            return { userId, product_id, quantity };
        }
    }

    static async getCartItems(userId) {
        const query = `
            SELECT ci.user_id, ci.product_id, ci.quantity, p.* 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `;
        
        const [items] = await db.query(query, [userId]);
        return items;
    }

    static async updateCartItem(userId, product_id, quantity) {
        await db.query("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?", [quantity, userId, product_id]);
        return { userId, product_id, quantity };
    }

    static async removeCartItem(userId, product_id) {
        const [res] = await db.query("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", [userId, product_id]);
        if (res.affectedRows === 0) {
            throw new Error('Cart not found');
        }
    }

}

module.exports = CartItem;
