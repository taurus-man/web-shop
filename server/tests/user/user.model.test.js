const db = require('../../db'); // Adjust the path as necessary
const User = require('../../models/User');

// Mock the db module
jest.mock('../../db', () => ({
    query: jest.fn(),
}));

const users = [
    {
        "id": 1,
        "name": "user1",
        "email": "user1@mail.com",
        "password": "user1pass",
        "created_at": "2024-03-25T16:49:15.000Z",
        "isAdmin": 0
    },
    {
        "id": 2,
        "name": "user2",
        "email": "user2@mail.com",
        "password": "user2pass",
        "created_at": "2024-03-26T11:24:10.000Z",
        "isAdmin": 1
    }
];

describe('User Model', () => {
    beforeEach(() => {
        // Clear mock calls before each test
        db.query.mockClear();
    });

    test('create - adds a new user and returns it', async () => {
        const newUser = users[0];
        const insertId = 1; // Simulated insert ID
        db.query.mockResolvedValue([{ insertId }, undefined]);

        const result = await User.create(newUser);

        expect(db.query).toHaveBeenCalledWith("INSERT INTO users SET ?", [newUser]);
        expect(result).toEqual({ id: insertId, ...newUser });
    });

    test('findById - finds a user by ID', async () => {
        const user_id = 1;
        const user = users[0];
        db.query.mockResolvedValue([[user], undefined]);

        const result = await User.findById(user_id);

        expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = ?", [user_id]);
        expect(result).toEqual(user);
    });

    test('findAll - returns all users', async () => {
        const usersMock = users;
        db.query.mockResolvedValue([usersMock, undefined]);

        const result = await User.findAll();

        expect(db.query).toHaveBeenCalledWith("SELECT * FROM users");
        expect(result).toEqual(usersMock);
    });

    test('updateById - updates a user and returns the updated user', async () => {
        const user_id = 1;
        const updatedUser = { ...users[0], name: 'Updated User' };

        db.query.mockResolvedValueOnce([{ affectedRows: 1 }, undefined]);
        db.query.mockResolvedValueOnce([[{ id: user_id, ...updatedUser }], undefined]);

        const result = await User.updateById(user_id, updatedUser);

        expect(db.query).toHaveBeenCalledWith(
            "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
            [updatedUser.name, updatedUser.email, updatedUser.password, user_id]
        );
        expect(result).toEqual({ id: user_id, ...updatedUser });
    });

    test('remove - deletes a user by ID', async () => {
        const user_id = 1;
        db.query.mockResolvedValue([{ affectedRows: 1 }, undefined]); // Simulate successful deletion

        await User.remove(user_id);

        expect(db.query).toHaveBeenCalledWith("DELETE FROM users WHERE id = ?", [user_id]);
    });
});

describe('User Model - Error Handling', () => {
    beforeEach(() => {
        db.query.mockClear();
    });

    test('create - handles database errors', async () => {
        const newUser = users[0];
        db.query.mockRejectedValue(new Error('Database error'));

        await expect(User.create(newUser)).rejects.toThrow('Database error');
    });

    test('findById - handles database errors', async () => {
        const user_id = 1;
        db.query.mockRejectedValue(new Error('Database error'));

        await expect(User.findById(user_id)).rejects.toThrow('Database error');
    });

    test('findAll - handles database errors', async () => {
        db.query.mockRejectedValue(new Error('Database error'));

        await expect(User.findAll()).rejects.toThrow('Database error');
    });

    test('updateById - handles database errors', async () => {
        const user_id = 1;
        const updatedUser = users[0];
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error during update

        await expect(User.updateById(user_id, updatedUser)).rejects.toThrow('Database error');
    });

    test('remove - handles database errors', async () => {
        const user_id = 1;
        db.query.mockRejectedValue(new Error('Database error')); // Simulate error during deletion

        await expect(User.remove(user_id)).rejects.toThrow('Database error');
    });
});
