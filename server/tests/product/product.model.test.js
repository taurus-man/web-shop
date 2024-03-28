const db = require('../../db');
const Product = require('../../models/Product');

// Mock the db module
jest.mock('../../db', () => ({
    query: jest.fn(),
}));

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

describe('Product Model', () => {
    beforeEach(() => {
        // Clear mock calls before each test
        db.query.mockClear();
    });

    test('create - adds a new product and returns it', async () => {
        const newProduct = products[0];
        // const newProduct = { name: 'Test Product', price: 100, description: 'A test product', image_url: 'http://example.com/product.jpg' };
        const insertId = 1; // Simulated insert ID
        db.query.mockResolvedValue([{ insertId }, undefined]);

        const result = await Product.create(newProduct);

        expect(db.query).toHaveBeenCalledWith("INSERT INTO products SET ?", [newProduct]);
        expect(result).toEqual({ id: insertId, ...newProduct });
    });

    test('findById - finds a product by ID', async () => {
        const product_id = 1;
        // const product = { id: product_id, name: 'Test Product' };
        const product = products[0];
        db.query.mockResolvedValue([[product], undefined]);

        const result = await Product.findById(product_id);

        expect(db.query).toHaveBeenCalledWith("SELECT * FROM products WHERE id = ?", [product_id]);
        expect(result).toEqual(product);
    });

    test('findAll - returns all products', async () => {
        const productsMock = products;
        // const products = [{ id: 1, name: 'Test Product 1' }, { id: 2, name: 'Test Product 2' }];
        db.query.mockResolvedValue([productsMock, undefined]);

        const result = await Product.findAll();

        expect(db.query).toHaveBeenCalledWith("SELECT * FROM products");
        expect(result).toEqual(productsMock);
    });

    test('updates a product and returns the updated product', async () => {
        const product_id = 1;
        // const updatedProduct = {
        //     name: 'Updated Product',
        //     description: 'An updated product',
        //     price: 150,
        //     image_url: 'http://example.com/updated_product.jpg'
        // };
        const updatedProduct = products[1];

        db.query.mockResolvedValueOnce([{ affectedRows: 1 }, undefined]);
        db.query.mockResolvedValueOnce([[{ id: product_id, ...updatedProduct }], undefined]);

        const result = await Product.updateById(product_id, updatedProduct);

        expect(db.query).toHaveBeenCalledWith(
            "UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?",
            [updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.image_url, product_id]
        );

        expect(result).toEqual({ id: product_id, ...updatedProduct });
    });

    test('remove - deletes a product by ID', async () => {
        const product_id = 1;
        db.query.mockResolvedValue([{ affectedRows: 1 }, undefined]); // Simulate successful deletion

        await Product.remove(product_id);

        expect(db.query).toHaveBeenCalledWith("DELETE FROM products WHERE id = ?", [product_id]);
    });
});

describe('Product Model - Error Handling', () => {
    beforeEach(() => {
        db.query.mockClear();
    });

    test('create - handles database errors', async () => {
        // const newProduct = { name: 'Test Product', price: 100, description: 'A test product', image_url: 'http://example.com/product.jpg' };
        const newProduct = products[0];
        db.query.mockRejectedValue(new Error('Database error'));

        await expect(Product.create(newProduct)).rejects.toThrow('Database error');
    });

    test('findById - handles database errors', async () => {
        const product_id = 1;
        db.query.mockRejectedValue(new Error('Database error'));

        await expect(Product.findById(product_id)).rejects.toThrow('Database error');
    });

    test('findAll - handles database errors', async () => {
        db.query.mockRejectedValue(new Error('Database error'));

        await expect(Product.findAll()).rejects.toThrow('Database error');
    });

    test('updateById - handles database errors', async () => {
        const product_id = 1;
        const updatedProduct = products[0];
        // const updatedProduct = { name: 'Updated Product', price: 150, description: 'An updated product', image_url: 'http://example.com/updated_product.jpg' };
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error during update

        await expect(Product.updateById(product_id, updatedProduct)).rejects.toThrow('Database error');
    });

    test('remove - handles database errors', async () => {
        const product_id = 1;
        db.query.mockRejectedValue(new Error('Database error')); // Simulate error during deletion

        await expect(Product.remove(product_id)).rejects.toThrow('Database error');
    });
});
