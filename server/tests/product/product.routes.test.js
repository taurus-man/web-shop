const express = require('express');
const request = require('supertest');
const productRoutes = require('../../routes/productRoutes');
const productController = require('../../controllers/productController');
const requireLogin = jest.fn((req, res, next) => next());
const requireAdmin = jest.fn((req, res, next) => next());

jest.mock('../../controllers/productController');
jest.mock('../../middleware/requireLogin', () => (req, res, next) => next());
jest.mock('../../middleware/requireAdmin', () => (req, res, next) => next());

const products = [
    {
        "id": 1,
        "name": "prod1",
        "description": "Lorem Ipsum is 1",
        "price": "56.65",
        "image_url": "https://picsum.photos/seed/random101/300/700",
        "created_at": "2024-03-27T17:53:23.000Z"
    },
    {
        "id": 2,
        "name": "prod2",
        "description": "Lorem Ipsum is 2",
        "price": "56.65",
        "image_url": "https://picsum.photos/seed/random102/300/700",
        "created_at": "2024-03-27T17:53:23.000Z"
    }
]

describe('Product Routes', () => {
    const app = express();
    app.use(express.json());
    app.use(productRoutes);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET / - Fetch all products', async () => {
        productController.getAllProducts.mockImplementation((req, res) => res.json(products));
        
        const response = await request(app).get('/');
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(products);
        expect(productController.getAllProducts).toHaveBeenCalledTimes(1);
    });

    test('GET /:id - Fetch a single product by ID', async () => {
        const mockProduct = products[0];
        productController.getProductById.mockImplementation((req, res) => res.json(mockProduct));
        
        const response = await request(app).get('/1');
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockProduct);
    });

    test('POST / - Create a new product', async () => {
        const newProduct = products[0];
        productController.createProduct.mockImplementation((req, res) => res.status(201).json(newProduct));
        
        const response = await request(app).post('/').send(newProduct);
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(newProduct);
    });

    test('PUT /:id - Update a product', async () => {
        const updatedProduct = products[0];
        productController.updateProduct.mockImplementation((req, res) => res.json(updatedProduct));
        
        const response = await request(app).put('/1').send(updatedProduct);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(updatedProduct);
    });

    test('DELETE /:id - Delete a product', async () => {
        productController.deleteProduct.mockImplementation((req, res) => res.status(204).send());
        
        const response = await request(app).delete('/1');
        
        expect(response.statusCode).toBe(204);
    });
});

describe('Product Routes - Error Handling', () => {
    const app = express();
    app.use(express.json());
    app.use(productRoutes);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET / - Error fetching products', async () => {
        productController.getAllProducts.mockImplementation((req, res) => {
            res.status(500).json({ message: "Internal server error" });
        });

        const response = await request(app).get('/');

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: "Internal server error" });
    });

    test('GET /:id - Error fetching a single product by ID (not found)', async () => {
        productController.getProductById.mockImplementation((req, res) => {
            res.status(404).json({ message: "Product not found" });
        });

        const response = await request(app).get('/999'); // Assuming 999 is an ID that does not exist

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "Product not found" });
    });

    test('POST / - Error creating a new product (validation error)', async () => {
        productController.createProduct.mockImplementation((req, res) => {
            res.status(400).json({ message: "Missing required fields" });
        });

        const response = await request(app).post('/').send({}); // Send an empty body to simulate validation error

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: "Missing required fields" });
    });

    test('PUT /:id - Error updating a product (not found)', async () => {
        productController.updateProduct.mockImplementation((req, res) => {
            res.status(404).json({ message: "Product not found" });
        });

        const response = await request(app).put('/999').send({ name: "Updated Name" }); // Assuming 999 does not exist

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "Product not found" });
    });

    test('DELETE /:id - Error deleting a product (not found)', async () => {
        productController.deleteProduct.mockImplementation((req, res) => {
            res.status(404).json({ message: "Product not found" });
        });

        const response = await request(app).delete('/999'); // Assuming 999 does not exist

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "Product not found" });
    });
});

