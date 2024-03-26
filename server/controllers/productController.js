const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving products."
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) res.status(404).send({ message: "Product not found" });
        else res.json(product);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving product with id=" + req.params.id
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json(product);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the product."
        });
    }
};

exports.updateProduct = async (req, res) => {
    const { name, price, description } = req.body;
    
    if (!name || !price || typeof description === 'undefined') {
        return res.status(400).send({ message: 'Invalid or missing fields' });
    }

    try {
        await Product.updateById(req.params.id, { name, price, description });
        const updatedProduct = await Product.findById(req.params.id);
        res.json(updatedProduct);
    } catch (error) {
        if (error.kind === 'not_found') {
            res.status(404).send({ message: `Product not found with id ${req.params.id}.` });
        } else {
            res.status(500).send({ message: error.message || 'An error occurred while updating the product.' });
        }
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.remove(req.params.id);
        res.send({ message: "Product was deleted successfully!" });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete product with id=" + req.params.id
        });
    }
};
