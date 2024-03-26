const db = require('../db');

class User {
    static async create(newUser) {
        const [res] = await db.query("INSERT INTO users SET ?", [newUser]);
        return { id: res.insertId, ...newUser };
    }

    static async findById(userId) {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
        return rows.length ? rows[0] : null;
    }

    static async findByEmail(email) {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows.length ? rows[0] : null;
    }

    static async findAll() {
        const [rows] = await db.query("SELECT * FROM users");
        return rows;
    }

    static async updateById(id, { name, email, password }) {
        await db.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [name, email, password, id]);
        return this.findById(id);
    }

    static async updateName(id, newName) {
        await db.query("UPDATE users SET name = ? WHERE id = ?", [newName, id]);
        return this.findById(id);
    }

    static async remove(id) {
        const [res] = await db.query("DELETE FROM users WHERE id = ?", [id]);
        if (res.affectedRows === 0) {
            throw new Error('User not found');
        }
    }
}

module.exports = User;
