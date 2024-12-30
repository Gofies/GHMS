//test for lab test controllers

import { getResults, getLabTests } from '../../../controllers/lab.controllers/test.controller.js';
import LabTechnician from '../../../models/lab.technician.model.js';

jest.mock('../../../models/lab.technician.model.js');

describe('Lab Technician Controller - Results and Lab Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getResults', () => {
        it('should retrieve lab results successfully', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            const mockResults = {
                hospital: {
                    labTests: [
                        {
                            patient: { name: 'John', surname: 'Doe' },
                            doctor: { name: 'Dr. Smith', surname: 'Williams' },
                            testtype: 'Blood Test',
                            status: 'completed'
                        }
                    ]
                }
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(mockResults)
            });

            await getResults(req, res);

            expect(LabTechnician.findById).toHaveBeenCalledWith('labTech123');
            expect(res.json).toHaveBeenCalledWith(mockResults);
        });

        it('should return 404 if results are not found', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(null)
            });

            await getResults(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Results not found' });
        });

        it('should return 500 if there is a server error', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockRejectedValue(new Error('Database Error'))
            });

            await getResults(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Server Error');
        });
    });

    describe('getLabTests', () => {
        it('should retrieve lab tests and categorize them by status', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            const mockLabTests = {
                hospital: {
                    labTests: [
                        { status: 'pending', testtype: 'X-ray' },
                        { status: 'completed', testtype: 'MRI' }
                    ]
                }
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(mockLabTests)
            });

            await getLabTests(req, res);

            expect(LabTechnician.findById).toHaveBeenCalledWith('labTech123');
            expect(res.json).toHaveBeenCalledWith({
                pendingTests: [mockLabTests.hospital.labTests[0]],
                completedTests: [mockLabTests.hospital.labTests[1]]
            });
        });

        it('should return 404 if no lab tests are found', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(null)
            });

            await getLabTests(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Lab tests not found' });
        });

        it('should return 500 if there is an error during retrieval', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockRejectedValue(new Error('Database Error'))
            });

            await getLabTests(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Server Error');
        });
    });
});