const User = require('../models/User');
const { isValidEmail } = require('../utilities/validators');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) res.status(404).send({ message: "User not found" });
        else res.json(user);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving user with id=" + req.params.id
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving user profile."
        });
    }
};

exports.createUser = async (req, res) => {
    if (!isValidEmail(req.body.email)) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    }
};

exports.updateUser = async (req, res) => {
    if (!req.body.name || !req.body.email) {
        return res.status(400).send({ message: 'Name and email are required' });
    }

    if (!isValidEmail(req.body.email)) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    try {
        const user = await User.updateById(req.params.id, req.body);
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            res.json(user);
        }
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occurred while updating the user.' });
    }
};

exports.updateProfile = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send({ message: 'Name is required' });
    }

    try {
        const updatedUser = await User.updateName(req.user.id, name);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occurred while updating the profile.' });
    }
};



exports.deleteUser = async (req, res) => {
    try {
        await User.remove(req.params.id);
        res.send({ message: "User was deleted successfully!" });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete user with id=" + req.params.id
        });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await User.remove(req.user.id);
        res.send({ message: "User was deleted successfully!" });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete user profile."
        });
    }
};
