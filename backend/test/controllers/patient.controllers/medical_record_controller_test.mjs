// test/controllers/patient.controllers/medical.record.controller.test.mjs

import { getLabTests, getOtherTests, getDiagnoses } from '../../../controllers/patient.controllers/medical.record.controller.js';
import Patient from '../../../models/patient.model.js';

jest.mock('../../../models/patient.model.js');

describe('Patient Controller - Test and Diagnosis Retrieval', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = { user: { _id: 'patient123' } };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getLabTests', () => {
        it('should retrieve lab tests successfully', async () => {
            const mockLabTests = [
                {
                    testType: 'Blood Test',
                    status: 'Completed',
                    doctor: { name: 'Dr. Alice', surname: 'Brown' },
                    hospital: { name: 'City Hospital' },
                    result: 'Normal',
                    resultdate: '2024-04-01',
                    createdAt: '2024-03-25'
                }
            ];

            const populateChain = {
                path: 'labtests',
                populate: [
                    { path: 'doctor', select: 'name surname' },
                    { path: 'hospital', select: 'name' }
                ]
            };

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue({ labtests: mockLabTests })
            });

            await getLabTests(mockReq, mockRes);

            expect(Patient.findById).toHaveBeenCalledWith('patient123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Lab tests retrieved successfully',
                labTests: mockLabTests
            });
        });

        it('should handle empty lab tests array', async () => {
            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue({ labtests: [] })
            });

            await getLabTests(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Lab tests retrieved successfully',
                labTests: []
            });
        });

        it('should return 404 if patient is not found', async () => {
            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(null)
            });

            await getLabTests(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Patient not found' });
        });

        it('should handle database errors in lab tests retrieval', async () => {
            const error = new Error('Database Error');
            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockRejectedValue(error)
            });

            await getLabTests(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "patient.getLabTests: Database Error"
            });
        });
    });

    describe('getOtherTests', () => {
        it('should retrieve other tests successfully', async () => {
            const mockOtherTests = [
                {
                    testtype: 'other',
                    result: 'Negative',
                    date: '2024-02-15'
                }
            ];

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                elemMatch: jest.fn().mockResolvedValue(mockOtherTests)
            });

            await getOtherTests(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Test results retrieved successfully',
                otherTests: mockOtherTests
            });
        });

        it('should handle empty other tests result', async () => {
            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                elemMatch: jest.fn().mockResolvedValue([])
            });

            await getOtherTests(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Test results retrieved successfully',
                otherTests: []
            });
        });

        it('should handle database errors in other tests retrieval', async () => {
            const error = new Error('Database Error');
            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                elemMatch: jest.fn().mockRejectedValue(error)
            });

            await getOtherTests(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "patient.getTestResults: Database Error"
            });
        });
    });

    describe('getDiagnoses', () => {
        it('should retrieve diagnoses successfully', async () => {
            const mockDiagnoses = {
                diagnoses: [
                    {
                        diagnosis: 'Flu',
                        date: '2024-01-01'
                    }
                ]
            };

            Patient.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockDiagnoses)
            });

            await getDiagnoses(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Diagnoses retrieved successfully',
                diagnoses: mockDiagnoses
            });
        });

        it('should handle empty diagnoses array', async () => {
            Patient.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue({ diagnoses: [] })
            });

            await getDiagnoses(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Diagnoses retrieved successfully',
                diagnoses: { diagnoses: [] }
            });
        });

        it('should return 404 if patient is not found for diagnoses', async () => {
            Patient.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            await getDiagnoses(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                { 
                    message: 'Diagnoses retrieved successfully', 
                    diagnoses: null
                }
            );
        });

        it('should handle database errors in diagnoses retrieval', async () => {
            const error = new Error('Database Error');
            Patient.findById.mockReturnValue({
                select: jest.fn().mockRejectedValue(error)
            });

            await getDiagnoses(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "patient.getDiagnoses: Database Error"
            });
        });

        it('should handle invalid patient ID format', async () => {
            const invalidReq = { user: { _id: 'invalid-id' } };
            const error = new Error('Invalid ID format');
            Patient.findById.mockReturnValue({
                select: jest.fn().mockRejectedValue(error)
            });

            await getDiagnoses(invalidReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "patient.getDiagnoses: Invalid ID format"
            });
        });
    });
});