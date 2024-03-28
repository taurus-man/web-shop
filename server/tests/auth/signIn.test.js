const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const authRoutes = require('../../routes/authRoutes');

const app = express();
app.use(express.json());
app.use(authRoutes);

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'fakeToken'),
}));


jest.mock('../../models/User', () => ({
    findByEmail: jest.fn(),
    create: jest.fn(),
}));


describe('/signin route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should require email and password', async () => {
        const response = await request(app)
            .post('/signin')
            .send({});

        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ error: "Please provide required fields!" });
    });

    test('should reject invalid email or password', async () => {
        User.findByEmail.mockResolvedValue(null);

        const response = await request(app)
            .post('/signin')
            .send({ email: 'nonexistent@example.com', password: 'password' });

        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ error: "Invalid email or password." });
    });

    test('should sign in successfully with valid credentials', async () => {
        const savedUser = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword'
        };
        const token = 'fakeToken';

        User.findByEmail.mockResolvedValue(savedUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue(token);

        const response = await request(app)
            .post('/signin')
            .send({ email: savedUser.email, password: 'password' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: "Successfully logged in",
            token,
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email
            }
        });

        expect(jwt.sign).toHaveBeenCalled();
    });

    test('should handle unexpected errors', async () => {
        User.findByEmail.mockRejectedValue(new Error('Unexpected error'));

        const response = await request(app)
            .post('/signin')
            .send({ email: 'john@example.com', password: 'password' });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: "An error occurred during signin" });
    });
});
