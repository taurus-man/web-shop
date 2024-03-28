const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../../controllers/productController');
const Product = require('../../models/Product');

jest.mock('../../models/Product');

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

describe('Product Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {};
        mockRes = {
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
    });

    test('getAllProducts successfully retrieves products', async () => {
        const mockProducts = products;
        Product.findAll.mockResolvedValue(mockProducts);

        await getAllProducts(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    test('getAllProducts handles errors', async () => {
        Product.findAll.mockRejectedValue(new Error('Error retrieving products'));

        await getAllProducts(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalled();
    });

    test('getProductById finds a product', async () => {
        const product_id = 1;
        const mockProduct = products[0];
        Product.findById.mockResolvedValue(mockProduct);

        mockReq.params = { id: product_id };
        await getProductById(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    test('getProductById handles product not found', async () => {
        Product.findById.mockResolvedValue(null);

        mockReq.params = { id: 999 };
        await getProductById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    test('getProductById handles errors', async () => {
        Product.findById.mockRejectedValue(new Error('Error finding product'));

        mockReq.params = { id: 1 };
        await getProductById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    test('createProduct successfully creates a product', async () => {
        const newProduct = products[1];
        Product.create.mockResolvedValue(newProduct);

        mockReq.body = newProduct;
        await createProduct(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(newProduct);
    });

    test('createProduct handles errors', async () => {
        Product.create.mockRejectedValue(new Error('Error creating product'));

        mockReq.body = products[1];
        await createProduct(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    test('updateProduct successfully updates a product', async () => {
        const product_id = 1;
        const updatedProduct = products[0];
    
        Product.updateById.mockResolvedValue(true);
    
        Product.findById.mockResolvedValue(updatedProduct);
    
        mockReq.params = { id: product_id };
        mockReq.body = updatedProduct;
    
        await updateProduct(mockReq, mockRes);
    
        expect(mockRes.json).toHaveBeenCalledWith(updatedProduct);
    });
    
    test('updateProduct handles invalid input', async () => {
        mockReq.params = { id: 1 };
        mockReq.body = {}; // Missing required fields
        await updateProduct(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('updateProduct handles product not found', async () => {
        mockReq.params = { id: 'nonexistent-id' };
        mockReq.body = products[0]
    
        Product.updateById.mockRejectedValue({ kind: 'not_found' });
    
        await updateProduct(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith({ message: `Product not found with id ${mockReq.params.id}.` });
    });
    

    test('deleteProduct successfully deletes a product', async () => {
        Product.remove.mockResolvedValue();

        mockReq.params = { id: 1 };
        await deleteProduct(mockReq, mockRes);

        expect(mockRes.send).toHaveBeenCalledWith({ message: "Product was deleted successfully!" });
    });

    test('deleteProduct handles product not found', async () => {
        Product.remove.mockRejectedValue(new Error('Product not found'));

        mockReq.params = { id: 999 };
        await deleteProduct(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
    });
});
