const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const requireAdmin = require('../../middleware/requireAdmin');


jest.mock('../../models/User', () => ({
    findById: jest.fn(),
}));

jest.mock('jsonwebtoken', () => {
    const originalModule = jest.requireActual('jsonwebtoken');
    return {
        ...originalModule,
        verify: jest.fn((token, secret, callback) => {
            if (secret !== process.env.JWT_SECRET) {
                throw new Error("Invalid token or secret");
            }
            // Simulate token verification success
            callback(null, { _id: "mockUserId" });
        }),
    };
});


describe('requireAdmin middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            headers: {
                authorization: "Bearer token123"
            }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();

        process.env.JWT_SECRET = 'testsecret';
    });


    test('should require authorization header', async () => {
        mockReq.headers = {}; // Simulate missing authorization header

        await requireAdmin(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "You must be logged in!" });
    });

    test('should deny access if user is not admin', async () => {
        jwt.verify.mockReturnValue({ _id: "user123" });
        User.findById.mockResolvedValue({ _id: "user123", isAdmin: false });

        await requireAdmin(mockReq, mockRes, mockNext);

        expect(User.findById).toHaveBeenCalledWith("user123");
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Access denied. Admins only." });
    });

    test('should allow access if user is admin', async () => {
        jwt.verify.mockReturnValue({ _id: "admin123" });
        User.findById.mockResolvedValue({ _id: "admin123", isAdmin: true });

        await requireAdmin(mockReq, mockRes, mockNext);

        expect(User.findById).toHaveBeenCalledWith("admin123");
        expect(mockNext).toHaveBeenCalled();
    });

    afterEach(() => {
        delete process.env.JWT_SECRET; // Clean up environment variable
    });
});
