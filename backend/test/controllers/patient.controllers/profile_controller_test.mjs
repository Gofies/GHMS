//profile controller test
import { getProfile, updateProfile } from '../../../controllers/patient.controllers/profile.controller.js';
import Patient from '../../../models/patient.model.js';

jest.mock('../../../models/patient.model.js');

describe('Patient Controller - Profile Management', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getProfile', () => {
        it('should retrieve the patient profile successfully', async () => {
            const req = { user: { _id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockPatient = {
                _id: 'patient123',
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com'
            };

            Patient.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockPatient)
            });

            await getProfile(req, res);

            expect(Patient.findById).toHaveBeenCalledWith('patient123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Profile retrieved successfully',
                patient: mockPatient
            });
        });

        it('should return 500 if an error occurs during profile retrieval', async () => {
            const req = { user: { _id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findById.mockReturnValue({
                select: jest.fn().mockRejectedValue(new Error('Database Error'))
            });

            await getProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringMatching(/patient.getProfile: Database Error/)
            });
        });
    });

    describe('updateProfile', () => {
        it('should update the patient profile successfully', async () => {
            const req = {
                user: { _id: 'patient123' },
                body: { name: 'Updated Name' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const updatedPatient = {
                _id: 'patient123',
                name: 'Updated Name',
                email: 'john@example.com'
            };

            Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

            await updateProfile(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                'patient123',
                { name: 'Updated Name' },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Profile updated successfully',
                patient: updatedPatient
            });
        });

        it('should return 500 if an error occurs during profile update', async () => {
            const req = {
                user: { _id: 'patient123' },
                body: { name: 'Updated Name' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockRejectedValue(new Error('Database Error'));

            await updateProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringMatching(/patient.updateProfile: Database Error/)
            });
        });
    });
});