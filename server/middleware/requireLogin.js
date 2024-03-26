const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const User = require('../models/User');

const requireLogin = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in!" });
    }

    const token = authorization.replace("Bearer ", "");
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload._id);
        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: `You must be logged in! ${error.message}` });
    }
};

module.exports = requireLogin;