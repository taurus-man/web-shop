const express = require('express');
const userController = require('../controllers/userController');
const requireLogin = require('../middleware/requireLogin');
const requireAdmin = require('../middleware/requireAdmin');
const router = express.Router();

// Specific routes
router.get('/profile', requireLogin, userController.getProfile);
router.put('/updateProfile', requireLogin, userController.updateProfile);
router.delete('/deleteProfile', requireLogin, userController.deleteProfile);

// General CRUD routes
router.get('/', requireLogin, requireAdmin, userController.getAllUsers);
router.post('/', requireLogin, requireAdmin, userController.createUser);
router.get('/:id', requireLogin, requireAdmin, userController.getUserById);
router.put('/:id', requireLogin, requireAdmin, userController.updateUser);
router.delete('/:id', requireLogin, requireAdmin, userController.deleteUser);


module.exports = router;
