const { getAllUsers, getUserById, createUser, updateUser, deleteUser, getProfile, updateProfile, deleteProfile } = require('../../controllers/userController');
const User = require('../../models/User');

jest.mock('../../models/User');

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
        "id": 2,
        "name": "user2",
        "email": "user2@mail.com",
        "password": "user2",
        "created_at": "2024-03-26T11:24:10.000Z",
        "isAdmin": 1
    }
];

describe('User Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {};
        mockRes = {
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
    });

    test('getAllUsers successfully retrieves users', async () => {
        User.findAll.mockResolvedValue(users);

        await getAllUsers(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(users);
    });

    test('getAllUsers handles errors', async () => {
        User.findAll.mockRejectedValue(new Error('Error retrieving users'));

        await getAllUsers(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalled();
    });

    test('getUserById finds a user', async () => {
        const user_id = 1;
        const mockUser = users.find(user => user.id === user_id);
        User.findById.mockResolvedValue(mockUser);

        mockReq.params = { id: user_id };
        await getUserById(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    test('getUserById handles user not found', async () => {
        User.findById.mockResolvedValue(null);

        mockReq.params = { id: 999 };
        await getUserById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    test('getUserById handles errors', async () => {
        User.findById.mockRejectedValue(new Error('Error finding user'));

        mockReq.params = { id: 1 };
        await getUserById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    test('createUser successfully creates a user', async () => {
        const newUser = users[0];
        User.create.mockResolvedValue(newUser);

        mockReq.body = newUser;
        await createUser(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(newUser);
    });

    test('createUser handles errors', async () => {
        User.create.mockRejectedValue(new Error('Error creating user'));

        mockReq.body = users[0];
        await createUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    test('updateUser successfully updates a user', async () => {
        const user_id = 1;
        const updatedUser = { ...users[0], name: 'Updated User' };

        User.updateById.mockResolvedValue(updatedUser);
        User.findById.mockResolvedValue(updatedUser);

        mockReq.params = { id: user_id };
        mockReq.body = updatedUser;
        await updateUser(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
    });

    test('updateUser handles invalid input', async () => {
        mockReq.params = { id: 1 };
        mockReq.body = {}; // Missing required fields
        await updateUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('updateUser handles user not found', async () => {
        User.updateById.mockRejectedValue({ kind: 'not_found' });

        mockReq.params = { id: 'nonexistent-id' };
        mockReq.body = users[0];

        await updateUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith({ message: `User not found with id ${mockReq.params.id}.` });
    });

    test('deleteUser successfully deletes a user', async () => {
        User.remove.mockResolvedValue();

        mockReq.params = { id: 1 };
        await deleteUser(mockReq, mockRes);

        expect(mockRes.send).toHaveBeenCalledWith({ message: "User was deleted successfully!" });
    });

    test('deleteUser handles user not found', async () => {
        User.remove.mockRejectedValue(new Error('User not found'));

        mockReq.params = { id: 999 };
        await deleteUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
    });
});


describe('User Profile Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            user: { id: 1 }
        };
        mockRes = {
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
    });

    test('getProfile successfully retrieves the user profile', async () => {
        const mockUser = users.find(user => user.id === mockReq.user.id);
        User.findById.mockResolvedValue(mockUser);
    
        await getProfile(mockReq, mockRes);
    
        expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    test('getUserById finds a user', async () => {
        const user_id = 1;
        const mockUser = users.find(user => user.id === user_id);
        User.findById.mockResolvedValue(mockUser);

        mockReq.params = { id: user_id };
        await getUserById(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    test('getProfile handles user not found', async () => {
        User.findById.mockResolvedValue(null);

        await getProfile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "User not found" });
    });

    test('getProfile handles errors', async () => {
        User.findById.mockRejectedValue(new Error('Error retrieving user profile'));

        await getProfile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Error retrieving user profile." });
    });

    test('updateProfile successfully updates the user profile', async () => {
        const updatedName = "Updated Name";
        mockReq.body = { name: updatedName };

        User.updateName.mockResolvedValue({ ...users[0], name: updatedName });

        await updateProfile(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ name: updatedName }));
    });

    test('updateUser successfully updates a user', async () => {
        const user_id = 1;
        const updatedUser = { ...users[0], name: 'Updated User' };

        User.updateById.mockResolvedValue(updatedUser);
        User.findById.mockResolvedValue(updatedUser);

        mockReq.params = { id: user_id };
        mockReq.body = updatedUser;
        await updateUser(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
    });

    test('updateProfile handles invalid input', async () => {
        mockReq.body = {}; // Missing 'name'

        await updateProfile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'Name is required' });
    });

    test('updateProfile handles errors', async () => {
        mockReq.body = { name: "New Name" };
        User.updateName.mockRejectedValue(new Error('An error occurred while updating the profile'));

        await updateProfile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'An error occurred while updating the profile.' });
    });

    test('deleteProfile successfully deletes the user profile', async () => {
        User.remove.mockResolvedValue();

        await deleteProfile(mockReq, mockRes);

        expect(mockRes.send).toHaveBeenCalledWith({ message: "User was deleted successfully!" });
    });

    test('deleteProfile handles errors', async () => {
        User.remove.mockRejectedValue(new Error('Could not delete user profile'));

        await deleteProfile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "Could not delete user profile." });
    });
});
