const express = require('express');
const request = require('supertest');
const userRoutes = require('../../routes/userRoutes');
const userController = require('../../controllers/userController');
jest.mock('../../controllers/userController');
jest.mock('../../middleware/requireLogin', () => (req, res, next) => next());
jest.mock('../../middleware/requireAdmin', () => (req, res, next) => next());

const users = [
    {
        "id": 1,
        "name": "user1",
        "email": "user1@mail.com",
        "password": "user1",
        "created_at": "2024-03-25T16:49:15.000Z",
        "isAdmin": 0
    },
    {
        "id": 3,
        "name": "user3",
        "email": "user3@mail.com",
        "password": "user3",
        "created_at": "2024-03-25T16:51:21.000Z",
        "isAdmin": 0
    }
];

describe('User Routes', () => {
    const app = express();
    app.use(express.json());
    app.use(userRoutes);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /profile - Fetch user profile', async () => {
        const userProfile = users[0];
        userController.getProfile.mockImplementation((req, res) => res.json(userProfile));

        const response = await request(app).get('/profile');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(userProfile);
    });

    test('PUT /updateProfile - Update user profile', async () => {
        const updatedUserInfo = { name: 'user1 updated' };
        userController.updateProfile.mockImplementation((req, res) => res.json({ ...users[0], ...updatedUserInfo }));

        const response = await request(app).put('/updateProfile').send(updatedUserInfo);

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toEqual(updatedUserInfo.name);
    });

    test('DELETE /deleteProfile - Delete user profile', async () => {
        userController.deleteProfile.mockImplementation((req, res) => res.status(204).send());

        const response = await request(app).delete('/deleteProfile');

        expect(response.statusCode).toBe(204);
    });

    test('GET / - Admin Fetch all users', async () => {
        userController.getAllUsers.mockImplementation((req, res) => res.json(users));
        
        const response = await request(app).get('/');
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(users);
        expect(userController.getAllUsers).toHaveBeenCalledTimes(1);
    });

    test('POST / - Admin creates a new user', async () => {
        const newUser = { name: "newUser", email: "newuser@mail.com", password: "newuser" };
        userController.createUser.mockImplementation((req, res) => res.status(201).json({ id: users.length + 1, ...newUser }));

        const response = await request(app).post('/').send(newUser);

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(expect.objectContaining(newUser));
    });

    test('GET /:id - Admin fetches a single user by ID', async () => {
        const mockUser = users[0];
        userController.getUserById.mockImplementation((req, res) => res.json(mockUser));

        const response = await request(app).get(`/${mockUser.id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    test('PUT /:id - Admin updates a user', async () => {
        const updatedUser = { name: "updatedUser" };
        userController.updateUser.mockImplementation((req, res) => res.json({ ...users[0], ...updatedUser }));

        const response = await request(app).put(`/${users[0].id}`).send(updatedUser);

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toEqual(updatedUser.name);
    });

    test('DELETE /:id - Admin deletes a user', async () => {
        userController.deleteUser.mockImplementation((req, res) => res.status(204).send());

        const response = await request(app).delete(`/${users[0].id}`);

        expect(response.statusCode).toBe(204);
    });

    // Implement further tests for other routes in a similar manner...
});

// Additional tests for error handling in user routes
describe('User Routes - Error Handling', () => {
    const app = express();
    app.use(express.json());
    app.use(userRoutes);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /profile - Error fetching user profile (not found)', async () => {
        userController.getProfile.mockImplementation((req, res) => {
            res.status(404).json({ message: "User profile not found" });
        });

        const response = await request(app).get('/profile');

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "User profile not found" });
    });

    test('PUT /updateProfile - Error updating user profile (validation error)', async () => {
        userController.updateProfile.mockImplementation((req, res) => {
            res.status(400).json({ message: "Missing required fields" });
        });

        const response = await request(app).put('/updateProfile').send({}); // Send an empty body

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: "Missing required fields" });
    });

    test('DELETE /deleteProfile - Error deleting user profile (not found)', async () => {
        userController.deleteProfile.mockImplementation((req, res) => {
            res.status(404).json({ message: "User profile not found" });
        });

        const response = await request(app).delete('/deleteProfile');

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "User profile not found" });
    });

    test('GET / - Error fetching users', async () => {
        userController.getAllUsers.mockImplementation((req, res) => {
            res.status(500).json({ message: "Internal server error" });
        });

        const response = await request(app).get('/');

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: "Internal server error" });
    });

        // Error handling for creating a user with invalid data
        test('POST / - Error creating a new user (invalid data)', async () => {
            const invalidUser = { email: "notanemail", password: "" }; // Intentionally missing name and invalid email format
            userController.createUser.mockImplementation((req, res) => {
                res.status(400).json({ message: "Invalid data provided" });
            });
    
            const response = await request(app).post('/').send(invalidUser);
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ message: "Invalid data provided" });
        });
    
        // Error handling for fetching a non-existent user by ID
        test('GET /:id - Error fetching a single user by ID (not found)', async () => {
            userController.getUserById.mockImplementation((req, res) => {
                res.status(404).json({ message: "User not found" });
            });
    
            const response = await request(app).get('/999'); // Assuming 999 is an ID that does not exist
    
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ message: "User not found" });
        });
    
        // Error handling for updating a non-existent user
        test('PUT /:id - Error updating a user (not found)', async () => {
            const updatedUser = { name: "DoesNotExist" };
            userController.updateUser.mockImplementation((req, res) => {
                res.status(404).json({ message: "User not found" });
            });
    
            const response = await request(app).put('/999').send(updatedUser); // Assuming 999 is an ID that does not exist
    
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ message: "User not found" });
        });
    
        // Error handling for deleting a non-existent user
        test('DELETE /:id - Error deleting a user (not found)', async () => {
            userController.deleteUser.mockImplementation((req, res) => {
                res.status(404).json({ message: "User not found" });
            });
    
            const response = await request(app).delete('/999'); // Assuming 999 is an ID that does not exist
    
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ message: "User not found" });
        });
    
        // Error handling for updating a user with invalid data
        test('PUT /:id - Error updating a user (invalid data)', async () => {
            const invalidData = { email: "notanemail" }; // Invalid email format
            userController.updateUser.mockImplementation((req, res) => {
                res.status(400).json({ message: "Invalid data provided" });
            });
    
            const response = await request(app).put(`/1`).send(invalidData);
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ message: "Invalid data provided" });
        });
});
