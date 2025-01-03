import { changePassword } from 'backend/controllers/doctor.controllers/auth.controller.js';
import Doctor from '../../../models/doctor.model.js';
import bcryptjs from 'bcryptjs';

jest.mock('../../../models/doctor.model.js');
jest.mock('bcryptjs');

describe('Auth Controller - changePassword', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if any field is missing', async () => {
        const req = {
            body: {
                currentPassword: undefined,
                newPassword: undefined,
                newPasswordConfirm: undefined,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should return 400 if new passwords do not match', async () => {
        const req = {
            body: {
                currentPassword: 'current123',
                newPassword: 'newpassword123',
                newPasswordConfirm: 'newpassword124',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Passwords do not match' });
    });

    it('should return 404 if doctor is not found', async () => {
        Doctor.findById.mockResolvedValue(null);

        const req = {
            user: { _id: 'doctorId123' },
            body: {
                currentPassword: 'current123',
                newPassword: 'newpassword123',
                newPasswordConfirm: 'newpassword123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await changePassword(req, res);

        expect(Doctor.findById).toHaveBeenCalledWith('doctorId123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'doctor not found' });
    });

    it('should return 400 if current password is invalid', async () => {
        Doctor.findById.mockResolvedValue({ password: 'hashedPassword123', save: jest.fn() });
        bcryptjs.compare.mockResolvedValue(false);

        const req = {
            user: { _id: 'doctorId123' },
            body: {
                currentPassword: 'wrongpassword',
                newPassword: 'newpassword123',
                newPasswordConfirm: 'newpassword123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await changePassword(req, res);

        expect(bcryptjs.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword123');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid current password' });
    });

    it('should return 200 if password is successfully updated', async () => {
        const mockDoctor = { password: 'hashedPassword123', save: jest.fn() };
        Doctor.findById.mockResolvedValue(mockDoctor);
        bcryptjs.compare.mockResolvedValue(true);
        bcryptjs.genSalt.mockResolvedValue('salt');
        bcryptjs.hash.mockResolvedValue('newHashedPassword123');

        const req = {
            user: { _id: 'doctorId123' },
            body: {
                currentPassword: 'current123',
                newPassword: 'newpassword123',
                newPasswordConfirm: 'newpassword123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await changePassword(req, res);

        expect(bcryptjs.compare).toHaveBeenCalledWith('current123', 'hashedPassword123');
        expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
        expect(bcryptjs.hash).toHaveBeenCalledWith('newpassword123', 'salt');
        expect(mockDoctor.password).toBe('newHashedPassword123');
        expect(mockDoctor.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
    });

    it('should return 500 if an error occurs', async () => {
        Doctor.findById.mockRejectedValue(new Error('Database error'));

        const req = {
            user: { _id: 'doctorId123' },
            body: {
                currentPassword: 'current123',
                newPassword: 'newpassword123',
                newPasswordConfirm: 'newpassword123',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Server error. Please try again later.',
        });
    });
});
