const { addItemToCart, getCartItems, updateCartItem, removeCartItem } = require('../../controllers/cartController');
const CartItem = require('../../models/CartItem');

// Mock CartItem model
jest.mock('../../models/CartItem');

describe('Cart Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            user: { id: 1 }, // Simulated logged-in user
            body: {}
        };
        mockRes = {
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
    });

    test('addItemToCart - adds item to cart successfully', async () => {
        const cartItem = { userId: 1, product_id: 1, quantity: 1 };
        CartItem.addToCart.mockResolvedValue(cartItem);

        mockReq.body = { product_id: 1, quantity: 1 };
        await addItemToCart(mockReq, mockRes);

        expect(CartItem.addToCart).toHaveBeenCalledWith({ userId: 1, product_id: 1, quantity: 1 });
        expect(mockRes.json).toHaveBeenCalledWith(cartItem);
    });

    test('getCartItems - retrieves cart items successfully', async () => {
        const cartItems = [{ userId: 1, product_id: 1, quantity: 2 }];
        CartItem.getCartItems.mockResolvedValue(cartItems);

        await getCartItems(mockReq, mockRes);

        expect(CartItem.getCartItems).toHaveBeenCalledWith(1);
        expect(mockRes.json).toHaveBeenCalledWith(cartItems);
    });

    test('updateCartItem - updates cart item successfully', async () => {
        const updatedItem = { userId: 1, product_id: 1, quantity: 3 };
        CartItem.updateCartItem.mockResolvedValue(updatedItem);

        mockReq.body = { product_id: 1, quantity: 3 };
        await updateCartItem(mockReq, mockRes);

        expect(CartItem.updateCartItem).toHaveBeenCalledWith(1, 1, 3);
        expect(mockRes.json).toHaveBeenCalledWith(updatedItem);
    });

    test('removeCartItem - removes cart item successfully', async () => {
        CartItem.removeCartItem.mockResolvedValue();

        mockReq.body = { product_id: 1 };
        await removeCartItem(mockReq, mockRes);

        expect(CartItem.removeCartItem).toHaveBeenCalledWith(1, 1);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Item removed from cart successfully." });
    });

    // Error handling tests
    test('addItemToCart - handles errors', async () => {
        CartItem.addToCart.mockRejectedValue(new Error('Error adding to cart'));

        mockReq.body = { product_id: 1, quantity: 1 };
        await addItemToCart(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Error adding to cart" });
    });

    test('getCartItems - handles errors', async () => {
        CartItem.getCartItems.mockRejectedValue(new Error('Error fetching cart items'));

        await getCartItems(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Error fetching cart items" });
    });

    test('updateCartItem - handles errors', async () => {
        CartItem.updateCartItem.mockRejectedValue(new Error('Error updating cart item'));

        mockReq.body = { product_id: 1, quantity: 3 };
        await updateCartItem(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Error updating cart item" });
    });

    test('removeCartItem - handles errors', async () => {
        CartItem.removeCartItem.mockRejectedValue(new Error('Error removing cart item'));

        mockReq.body = { product_id: 1 };
        await removeCartItem(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Error removing cart item" });
    });
});
