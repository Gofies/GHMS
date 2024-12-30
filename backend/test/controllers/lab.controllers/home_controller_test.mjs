//home controller test for lab controllers


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
        it('should mark the lab test as completed successfully', async () => {
            const req = {
                body: { testId: 'test123' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            LabTest.findByIdAndUpdate.mockResolvedValue({});

            await completeTest(req, res);

            expect(LabTest.findByIdAndUpdate).toHaveBeenCalledWith('test123', { status: 'completed' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Lab test completed successfully' });
        });

        it('should return 500 if there is an error during test completion', async () => {
            const req = {
                body: { testId: 'test123' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            LabTest.findByIdAndUpdate.mockRejectedValue(new Error('Database Error'));

            await completeTest(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Server Error');
        });
    });
});