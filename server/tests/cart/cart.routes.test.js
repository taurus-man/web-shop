const request = require('supertest');
const express = require('express');
const cartRoutes = require('../../routes/cartRoutes');
const CartItem = require('../../models/CartItem');

// Mocking CartItem model and requireLogin middleware
jest.mock('../../models/CartItem');
jest.mock('../../middleware/requireLogin', () => (req, res, next) => {
    req.user = { id: 1 }; // Simulate an authenticated user
    next();
});

const app = express();
app.use(express.json());
app.use(cartRoutes);

describe('Cart Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /add adds item to cart', async () => {
        const cartItem = { userId: 1, product_id: 1, quantity: 1 };
        CartItem.addToCart.mockResolvedValue(cartItem);

        const response = await request(app)
            .post('/add')
            .send({ product_id: 1, quantity: 1 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(cartItem);
        expect(CartItem.addToCart).toHaveBeenCalledWith({ userId: 1, product_id: 1, quantity: 1 });
    });

    test('GET / retrieves cart items', async () => {
        const cartItems = [{ userId: 1, product_id: 1, quantity: 2 }];
        CartItem.getCartItems.mockResolvedValue(cartItems);

        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(cartItems);
        expect(CartItem.getCartItems).toHaveBeenCalledWith(1);
    });

    test('PUT /update updates a cart item', async () => {
        const updatedItem = { userId: 1, product_id: 1, quantity: 3 };
        CartItem.updateCartItem.mockResolvedValue(updatedItem);

        const response = await request(app)
            .put('/update')
            .send({ product_id: 1, quantity: 3 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(updatedItem);
        expect(CartItem.updateCartItem).toHaveBeenCalledWith(1, 1, 3);
    });

    test('DELETE /remove removes a cart item', async () => {
        CartItem.removeCartItem.mockResolvedValue();

        const response = await request(app)
            .delete('/remove')
            .send({ product_id: 1 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Item removed from cart successfully." });
        expect(CartItem.removeCartItem).toHaveBeenCalledWith(1, 1);
    });

    test('POST /add handles adding item to cart error', async () => {
        CartItem.addToCart.mockRejectedValue(new Error('Error adding to cart'));

        const response = await request(app)
            .post('/add')
            .send({ product_id: 1, quantity: 1 });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: "Error adding to cart" });
    });

    test('GET / handles error retrieving cart items', async () => {
        CartItem.getCartItems.mockRejectedValue(new Error('Error fetching cart items'));

        const response = await request(app).get('/');

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: "Error fetching cart items" });
    });

    test('PUT /update handles error updating a cart item', async () => {
        CartItem.updateCartItem.mockRejectedValue(new Error('Error updating cart item'));

        const response = await request(app)
            .put('/update')
            .send({ product_id: 1, quantity: 3 });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: "Error updating cart item" });
    });

    test('DELETE /remove handles error removing a cart item', async () => {
        CartItem.removeCartItem.mockRejectedValue(new Error('Error removing cart item'));

        const response = await request(app)
            .delete('/remove')
            .send({ product_id: 1 });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: "Error removing cart item" });
    });

    test('DELETE /remove handles cart item not found error', async () => {
        CartItem.removeCartItem.mockRejectedValue(new Error('Cart not found'));

        const response = await request(app)
            .delete('/remove')
            .send({ product_id: 999 }); // Assuming this product does not exist in the user's cart

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: "Cart not found" });
    });

});
