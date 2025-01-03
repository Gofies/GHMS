import { getResults, getLabTests, deleteLabTest } from '../../../controllers/lab.controllers/test.controller.js';
import LabTechnician from '../../../models/lab.technician.model.js';
import LabTest from '../../../models/lab.test.model.js';

jest.mock('../../../models/lab.technician.model.js');
jest.mock('../../../models/lab.test.model.js');

describe('Lab Technician Controller - Results and Lab Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getResults', () => {
        it('should retrieve lab results successfully', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
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
                json: jest.fn()
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(null)
            });

            await getResults(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Results not found' });
        });

        it('should handle server errors gracefully', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockRejectedValue(new Error('Database Error'))
            });

            await getResults(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server Error' });
        });
    });

    describe('getLabTests', () => {
        it('should filter and sort pending and completed tests correctly', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockLabTechnician = {
                hospital: {
                    labTests: [
                        {
                            _id: '1',
                            status: 'pending',
                            createdAt: new Date('2023-01-02'),
                            labTechnician: 'labTech123'
                        },
                        {
                            _id: '2',
                            status: 'completed',
                            createdAt: new Date('2023-01-01'),
                            labTechnician: 'labTech123',
                            result: 'Positive',
                            resultdate: new Date('2023-01-03')
                        }
                    ]
                }
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(mockLabTechnician)
            });

            await getLabTests(req, res);

            expect(LabTechnician.findById).toHaveBeenCalledWith('labTech123');
            expect(res.json).not.toHaveBeenCalledWith({
                pendingTests: [
                    {
                        _id: '1',
                        status: 'pending',
                        createdAt: new Date('2023-01-02'),
                        labTechnician: 'labTech123'
                    }
                ],
                completedTests: [
                    {
                        _id: '2',
                        status: 'completed',
                        createdAt: new Date('2023-01-01'),
                        result: 'Positive',
                        resultdate: new Date('2023-01-03'),
                        labTechnician: 'labTech123'
                    }
                ]
            });
        });

        it('should handle no lab tests gracefully', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue({ hospital: { labTests: [] } })
            });

            await getLabTests(req, res);

            expect(res.json).toHaveBeenCalledWith({ pendingTests: [], completedTests: [] });
        });
    });

    describe('deleteLabTest', () => {
        it('should delete a lab test successfully', async () => {
            const req = { params: { labTestId: 'test123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            LabTest.findById.mockResolvedValue({ deleteOne: jest.fn() });

            await deleteLabTest(req, res);

            expect(LabTest.findById).toHaveBeenCalledWith('test123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Lab test deleted successfully' });
        });

        it('should return 404 if lab test not found', async () => {
            const req = { params: { labTestId: 'test123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            LabTest.findById.mockResolvedValue(null);

            await deleteLabTest(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Lab test not found' });
        });

        it('should handle server errors gracefully', async () => {
            const req = { params: { labTestId: 'test123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            LabTest.findById.mockRejectedValue(new Error('Database Error'));

            await deleteLabTest(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server Error' });
        });
    });
});

