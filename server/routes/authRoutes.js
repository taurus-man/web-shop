const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please add all the required fields!" });
    }

    try {
        const savedUser = await User.findByEmail(email);
        if (savedUser) {
            return res.status(422).json({ error: "User with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = { name, email, password: hashedPassword };
        const user = await User.create(newUser);
        res.json({ message: "Saved successfully!", user });
    } catch (error) {
        console.log("Error: Sign Up: ", error);
        res.status(500).json({ error: "An error occurred during signup" });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please provide required fields!" });
    }

    try {
        const savedUser = await User.findByEmail(email);
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email or password." });
        }

        const doMatch = await bcrypt.compare(password, savedUser.password);
        if (doMatch) {
            const token = jwt.sign({ _id: savedUser.id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
            });
            res.json({ message: "Successfully logged in", token, user: savedUser });
        } else {
            res.status(422).json({ error: "Invalid email or password." });
        }
    } catch (error) {
        console.log("Error: Sign In: ", error);
        res.status(500).json({ error: "An error occurred during signin" });
    }
});

module.exports = router;
