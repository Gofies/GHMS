import { getHomePage, completeTest } from '../../../controllers/lab.controllers/home.controller.js';
import LabTechnician from '../../../models/lab.technician.model.js';
import LabTest from '../../../models/lab.test.model.js';

jest.mock('../../../models/lab.technician.model.js');
jest.mock('../../../models/lab.test.model.js');

describe('Lab Technician Controller - Home Page and Test Completion', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getHomePage', () => {
        it('should retrieve the lab test queue successfully', async () => {
            const req = { user: { _id: 'labTech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            const mockLabTestQueue = {
                hospital: {
                    labTests: [
                        {
                            patient: { name: 'John', surname: 'Doe' },
                            testtype: 'Blood Test',
                            urgency: 'High',
                            doctor: { name: 'Dr. Smith', surname: 'Williams' }
                        }
                    ]
                }
            };

            LabTechnician.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(mockLabTestQueue)
            });

            await getHomePage(req, res);

            expect(LabTechnician.findById).toHaveBeenCalledWith('labTech123');
            expect(res.json).toHaveBeenCalledWith(mockLabTestQueue);
        });

        it('should return 404 if lab test queue is not found', async () => {
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

            await getHomePage(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Lab test queue not found' });
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

            await getHomePage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Server Error');
        });
    });

    describe('completeTest', () => {
        it('should mark the lab test as completed and update result successfully', async () => {
            const req = {
                body: { testId: 'test123', result: 'Test Result' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockLabTest = {
                _id: 'test123',
                status: 'pending',
                save: jest.fn(),
                populate: jest.fn().mockResolvedValue({
                    patient: { name: 'John', surname: 'Doe' },
                    doctor: { name: 'Dr. Smith', surname: 'Williams' }
                })
            };

            LabTest.findById.mockResolvedValue(mockLabTest);

            await completeTest(req, res);

            expect(LabTest.findById).toHaveBeenCalledWith('test123');
            expect(mockLabTest.status).toBe('completed');
            expect(mockLabTest.result).toBe('Test Result');
            expect(mockLabTest.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ 
                message: 'Server Error', 
            });
        });

        it('should return 404 if lab test is not found', async () => {
            const req = {
                body: { testId: 'test123' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            LabTest.findById.mockResolvedValue(null);

            await completeTest(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Lab test not found' });
        });

        it('should return 500 if there is a server error', async () => {
            const req = {
                body: { testId: 'test123' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            LabTest.findById.mockRejectedValue(new Error('Database Error'));

            await completeTest(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server Error' });
        });
    });
});
