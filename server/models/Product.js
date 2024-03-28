const db = require('../db');

class Product {
    static async create(newProduct) {
        const [res] = await db.query("INSERT INTO products SET ?", [newProduct]);
        return { id: res.insertId, ...newProduct };
    }

    static async findById(product_id) {
        const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [product_id]);
        return rows.length ? rows[0] : null;
    }

    static async findAll() {
        const [rows] = await db.query("SELECT * FROM products");
        return rows;
    }

    static async updateById(id, { name, description, price, image_url }) {
        await db.query("UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?", [name, description, price, image_url, id]);
        return this.findById(id);
    }

    static async remove(id) {
        const [res] = await db.query("DELETE FROM products WHERE id = ?", [id]);
        if (res.affectedRows === 0) {
            throw new Error('Product not found');
        }
    }
}

module.exports = Product;