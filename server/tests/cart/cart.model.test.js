const CartItem = require('../../models/CartItem');

// Mocking the db module
const db = require('../../db');
jest.mock('../../db', () => ({
    query: jest.fn(),
}));

describe('CartItem Model', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        db.query.mockClear();
    });

    test('adds a new item to the cart if not present', async () => {
        db.query.mockResolvedValueOnce([[]]); // Simulate no existing item
        await CartItem.addToCart({ userId: 1, product_id: 2, quantity: 1 });
        expect(db.query).toHaveBeenCalledWith("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)", [1, 2, 1]);
    });

    test('updates quantity if item already exists in the cart', async () => {
        db.query.mockResolvedValueOnce([[{ quantity: 1 }]]); // Simulate existing item with quantity 1
        await CartItem.addToCart({ userId: 1, product_id: 2, quantity: 2 });
        expect(db.query).toHaveBeenCalledWith("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?", [3, 1, 2]);
    });

    test('gets cart items for a user', async () => {
        db.query.mockResolvedValueOnce([[{ product_id: 2, quantity: 3 }]]); // Mocked response
        const items = await CartItem.getCartItems(1);
        expect(items).toEqual([{ product_id: 2, quantity: 3 }]);
        expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
    });

    test('updates cart item quantity', async () => {
        await CartItem.updateCartItem(1, 2, 5);
        expect(db.query).toHaveBeenCalledWith("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?", [5, 1, 2]);
    });

    test('removes an item from the cart', async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Simulate successful deletion
        await expect(CartItem.removeCartItem(1, 2)).resolves.not.toThrow();
        expect(db.query).toHaveBeenCalledWith("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", [1, 2]);
    });

    test('throws an error if trying to remove a non-existing cart item', async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]); // Simulate no rows affected
        await expect(CartItem.removeCartItem(1, 2)).rejects.toThrow('Cart not found');
    });
});
