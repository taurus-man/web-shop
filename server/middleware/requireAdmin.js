const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const User = require('../models/User');

const requireAdmin = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in!" });
    }
    const token = authorization.replace("Bearer ", "");
    try {
        const { _id } = jwt.verify(token, JWT_SECRET);
        const adminUser = await User.findById(_id);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }
        req.user = adminUser;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Authentication failed." });
    }
};

module.exports = requireAdmin;
