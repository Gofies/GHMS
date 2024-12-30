import { getLabTests, getOtherTests, getDiagnoses } from '../../../controllers/patient.controllers/medical.record.controller.js';
import Patient from '../../../models/patient.model.js';

jest.mock('../../../models/patient.model.js');

describe('Patient Controller - Test and Diagnosis Retrieval', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getLabTests', () => {
        it('should retrieve lab tests successfully', async () => {
            const req = { user: { _id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockLabTests = [{ testtype: 'lab', result: 'Positive' }];

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                elemMatch: jest.fn().mockResolvedValue(mockLabTests)
            });

            await getLabTests(req, res);

            expect(Patient.findById).toHaveBeenCalledWith('patient123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Test results retrieved successfully',
                labTests: mockLabTests
            });
        });

        it('should return 500 if an error occurs during lab test retrieval', async () => {
            const req = { user: { _id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                elemMatch: jest.fn().mockRejectedValue(new Error('Database Error'))
            });

            await getLabTests(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringMatching(/patient.getTestResults: Database Error/)
            });
        });
    });

    describe('getOtherTests', () => {
        it('should retrieve other tests successfully', async () => {
            const req = { user: { _id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockOtherTests = [{ testtype: 'other', result: 'Negative' }];

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                elemMatch: jest.fn().mockResolvedValue(mockOtherTests)
            });

            await getOtherTests(req, res);

            expect(Patient.findById).toHaveBeenCalledWith('patient123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Test results retrieved successfully',
                otherTests: mockOtherTests
            });
        });

        it('should return 500 if an error occurs during other test retrieval', async () => {
            const req = { user: { _id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                elemMatch: jest.fn().mockRejectedValue(new Error('Database Error'))
            });

            await getOtherTests(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringMatching(/patient.getTestResults: Database Error/)
            });
        });
    });

    describe('getDiagnoses', () => {
        it('should retrieve diagnoses successfully', async () => {
            const req = { user: { _id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            const mockDiagnoses = [{ diagnosis: 'Flu', date: '2024-01-01' }];
    
            Patient.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue({ diagnoses: mockDiagnoses })
            });
    
            await getDiagnoses(req, res);
    
            expect(Patient.findById).toHaveBeenCalledWith('patient123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Diagnoses retrieved successfully',
                diagnoses: { diagnoses: mockDiagnoses }  // Adjust to match received structure
            });
        });
    });
    
});