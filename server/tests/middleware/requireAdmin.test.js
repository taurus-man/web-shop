const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const requireAdmin = require('../../middleware/requireAdmin'); // Adjust the path as needed

// jest.mock('jsonwebtoken', () => ({
//     verify: jest.fn(),
// }));
jest.mock('../../models/User', () => ({
    findById: jest.fn(),
}));

// Inside your describe block or beforeEach, if you need it reset for each test
jest.mock('jsonwebtoken', () => {
    const originalModule = jest.requireActual('jsonwebtoken');
    return {
        ...originalModule,
        verify: jest.fn((token, secret, callback) => {
            if (secret !== process.env.JWT_SECRET) {
                throw new Error("Invalid token or secret");
            }
            // Simulate token verification success
            callback(null, { _id: "mockUserId" }); // Use callback style for async behavior
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

        process.env.JWT_SECRET = 'testsecret'; // Ensure your JWT_SECRET is set for the test environment
    });


    test('should require authorization header', async () => {
        mockReq.headers = {}; // Simulate missing authorization header

        await requireAdmin(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "You must be logged in!" });
    });

    // test('should handle invalid or expired token', () => {
    //     jwt.verify.mockImplementation(() => {
    //         throw new Error("Invalid token");
    //     });

    //     requireAdmin(mockReq, mockRes, mockNext);

    //     expect(jwt.verify).toHaveBeenCalledWith("token123", process.env.JWT_SECRET);

    //     expect(mockRes.status).toHaveBeenCalledWith(401);
    //     expect(mockRes.json).toHaveBeenCalledWith({ error: "Authentication failed." });

    //     // expect(jwt.verify).toHaveBeenCalledWith("token123", process.env.JWT_SECRET);
    //     // expect(mockRes.status).toHaveBeenCalledWith(401);
    //     // expect(mockRes.json).toHaveBeenCalledWith({ error: "Authentication failed." });

    //     // expect(jwt.verify).toHaveBeenCalledWith("token123", 'testsecret');
    //     // expect(mockRes.status).toHaveBeenCalledWith(401);
    //     // expect(mockRes.json).toHaveBeenCalledWith({ error: "Authentication failed." });
    // });

    // test('should handle invalid or expired token', () => {
    //     // Directly mock an error to simulate an invalid or expired token
    //     jwt.verify.mockImplementationOnce((token, secret, callback) => callback(new Error("Invalid token"), null));
    
    //     requireAdmin(mockReq, mockRes, mockNext);
    
    //     // Verify jwt.verify was called correctly
    //     expect(jwt.verify).toHaveBeenCalledWith("token123", process.env.JWT_SECRET, expect.any(Function));
    
    //     expect(mockRes.status).toHaveBeenCalledWith(401);
    //     expect(mockRes.json).toHaveBeenCalledWith({ error: "Authentication failed." });
    // });
    

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
        expect(mockNext).toHaveBeenCalled(); // Next function called indicating middleware passed
    });

    afterEach(() => {
        delete process.env.JWT_SECRET; // Clean up environment variable
    });
});
