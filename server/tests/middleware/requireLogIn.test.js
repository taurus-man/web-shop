// requireLogin.test.js
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const requireLogin = require('../../middleware/requireLogin'); // Adjust the path as needed

// Mocking jwt and User model
jest.mock('jsonwebtoken');
jest.mock('../../models/User');

describe('requireLogin Middleware', () => {
    // Helper function to create mock request and response objects
    const getMocks = () => {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        return { req, res, next };
    };

    test('should return 401 if no authorization header', async () => {
        const { req, res, next } = getMocks();

        await requireLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "You must be logged in!" });
    });

    test('should return 401 if token is invalid', async () => {
        const { req, res, next } = getMocks();
        req.headers.authorization = "Bearer invalidtoken";

        jwt.verify.mockImplementationOnce(() => {
            throw new Error("Invalid token");
        });

        await requireLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("You must be logged in!") }));
    });

    test('should return 401 if user not found', async () => {
        const { req, res, next } = getMocks();
        req.headers.authorization = "Bearer validtoken";

        jwt.verify.mockReturnValueOnce({ _id: "userId" });
        User.findById.mockResolvedValueOnce(null);

        await requireLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found." });
    });

    test('should call next if token is valid and user found', async () => {
        const { req, res, next } = getMocks();
        req.headers.authorization = "Bearer validtoken";
        const mockUser = { id: "userId", name: "Test User" };

        jwt.verify.mockReturnValueOnce({ _id: mockUser.id });
        User.findById.mockResolvedValueOnce(mockUser);

        await requireLogin(req, res, next);

        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
    });
});
