//auth controller test for lab controllers


import { changePassword } from '../../../controllers/lab.controllers/auth.controller.js';
import LabTechnician from '../../../models/lab.technician.model.js';
import bcryptjs from 'bcryptjs';

jest.mock('../../../models/lab.technician.model.js');
jest.mock('bcryptjs');

describe('Lab Technician Controller - changePassword', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should change the password successfully', async () => {
        const req = {
            user: { id: 'lab123' },
            body: { oldPassword: 'oldPass123', newPassword: 'newPass456' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        const mockLabTechnician = {
            _id: 'lab123',
            password: 'hashedOldPassword',
            save: jest.fn()
        };

        // Mock technician found
        LabTechnician.findById.mockResolvedValue(mockLabTechnician);
        // Mock password comparison
        bcryptjs.compare.mockResolvedValue(true);
        // Mock password hashing
        bcryptjs.hash.mockResolvedValue('hashedNewPassword');

        await changePassword(req, res);

        expect(LabTechnician.findById).toHaveBeenCalledWith('lab123');
        expect(bcryptjs.compare).toHaveBeenCalledWith('oldPass123', 'hashedOldPassword');
        expect(bcryptjs.hash).toHaveBeenCalledWith('newPass456', 12);
        expect(mockLabTechnician.password).toBe('hashedNewPassword');
        expect(mockLabTechnician.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
    });

    it('should return 404 if lab technician is not found', async () => {
        const req = {
            user: { id: 'lab123' },
            body: { oldPassword: 'oldPass123', newPassword: 'newPass456' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        LabTechnician.findById.mockResolvedValue(null);

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Lab technician not found' });
    });

    it('should return 400 if old password does not match', async () => {
        const req = {
            user: { id: 'lab123' },
            body: { oldPassword: 'wrongPass', newPassword: 'newPass456' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        const mockLabTechnician = {
            _id: 'lab123',
            password: 'hashedOldPassword'
        };

        LabTechnician.findById.mockResolvedValue(mockLabTechnician);
        bcryptjs.compare.mockResolvedValue(false);  // Password does not match

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 500 if there is a server error', async () => {
        const req = {
            user: { id: 'lab123' },
            body: { oldPassword: 'oldPass123', newPassword: 'newPass456' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        LabTechnician.findById.mockRejectedValue(new Error('Database Error'));

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server Error');
    });
});