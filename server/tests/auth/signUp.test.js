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
    sign: jest.fn().mockReturnValue('fakeToken'),
}));
jest.mock('../../models/User', () => ({
    findByEmail: jest.fn(),
    create: jest.fn(),
}));

describe('/signup route', () => {
    test('should require all fields', async () => {
        const response = await request(app)
            .post('/signup')
            .send({ name: 'John', email: 'john@example.com' }); // Omitting password
        
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ error: "Please add all the required fields!" });
    });

    test('should not allow signup with existing email', async () => {
        User.findByEmail.mockResolvedValue(true); // Simulate finding a user with the email

        const response = await request(app)
            .post('/signup')
            .send({ name: 'John', email: 'john@example.com', password: 'password123' });
        
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ error: "User with this email already exists." });
    });

    test('should sign up successfully', async () => {
        User.findByEmail.mockResolvedValue(null); // Simulate no user found with the email
        bcrypt.hash.mockResolvedValue('hashedPassword');
        User.create.mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com', password: 'hashedPassword' });

        const response = await request(app)
            .post('/signup')
            .send({ name: 'John', email: 'john@example.com', password: 'password123' });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Saved successfully!");
        expect(User.create).toHaveBeenCalledWith({
            name: 'John',
            email: 'john@example.com',
            password: expect.any(String) // Since the password is hashed
        });
    });
});
