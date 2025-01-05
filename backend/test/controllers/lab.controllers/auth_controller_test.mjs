import { changePassword } from '../../../controllers/lab.controllers/auth.controller.js';
import LabTechnician from '../../../models/lab.technician.model.js';
import bcryptjs from 'bcryptjs';

jest.mock('../../../models/lab.technician.model.js');
jest.mock('bcryptjs');

describe('Lab Technician Controller - changePassword', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        const req = {
            user: { _id: 'lab123' },
            body: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should return 400 if newPassword and newPasswordConfirm do not match', async () => {
        const req = {
            user: { _id: 'lab123' },
            body: { currentPassword: 'oldPass123', newPassword: 'newPass456', newPasswordConfirm: 'mismatchPass' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Passwords do not match' });
    });

    it('should return 404 if lab technician is not found', async () => {
        const req = {
            user: { _id: 'lab123' },
            body: { currentPassword: 'oldPass123', newPassword: 'newPass456', newPasswordConfirm: 'newPass456' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        LabTechnician.findById.mockResolvedValue(null);

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'labTechnician not found' });
    });

    it('should return 400 if current password is incorrect', async () => {
        const req = {
            user: { _id: 'lab123' },
            body: { currentPassword: 'wrongPass', newPassword: 'newPass456', newPasswordConfirm: 'newPass456' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockLabTechnician = {
            _id: 'lab123',
            password: 'hashedOldPassword'
        };

        LabTechnician.findById.mockResolvedValue(mockLabTechnician);
        bcryptjs.compare.mockResolvedValue(false);

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid current password' });
    });

    it('should change the password successfully', async () => {
        const req = {
            user: { _id: 'lab123' },
            body: { currentPassword: 'oldPass123', newPassword: 'newPass456', newPasswordConfirm: 'newPass456' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockLabTechnician = {
            _id: 'lab123',
            password: 'hashedOldPassword',
            save: jest.fn()
        };

        LabTechnician.findById.mockResolvedValue(mockLabTechnician);
        bcryptjs.compare.mockResolvedValue(true);
        bcryptjs.hash.mockResolvedValue('hashedNewPassword');

        await changePassword(req, res);

        expect(LabTechnician.findById).toHaveBeenCalledWith('lab123');
        expect(bcryptjs.compare).toHaveBeenCalledWith('oldPass123', 'hashedOldPassword');
        expect(bcryptjs.hash).not.toHaveBeenCalledWith('newPass456');
        expect(mockLabTechnician.password).toBe('hashedNewPassword');
        expect(mockLabTechnician.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
    });

    it('should return 500 if there is a server error', async () => {
        const req = {
            user: { _id: 'lab123' },
            body: { currentPassword: 'oldPass123', newPassword: 'newPass456', newPasswordConfirm: 'newPass456' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        LabTechnician.findById.mockRejectedValue(new Error('Database Error'));

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error. Please try again later.' });
    });
});
