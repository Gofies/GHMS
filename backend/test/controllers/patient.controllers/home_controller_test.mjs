// test/controllers/patient.controllers/home.controller.test.mjs

import { getPatientHome } from '../../../controllers/patient.controllers/home.controller.js';
import Patient from '../../../models/patient.model.js';

jest.mock('../../../models/patient.model.js');

describe('Patient Controller - getPatientHome', () => {
    let mockDate;
    
    beforeEach(() => {
        mockDate = new Date('2025-01-03T01:40:47.716Z');
        global.Date = class extends Date {
            constructor(...args) {
                if (args.length === 0) {
                    return mockDate;
                }
                return super(...args);
            }
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        global.Date = Date;
    });

    describe('getPatientHome', () => {
        it('should return upcoming and recent appointments correctly sorted', async () => {
            const req = { user: { id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            const mockAppointments = [
                {
                    date: new Date('2025-01-04T01:40:47.716Z'),
                    doctor: { name: 'John', surname: 'Doe' },
                    hospital: { name: 'City Hospital' },
                    polyclinic: { name: 'Cardiology' }
                },
                {
                    date: new Date('2025-01-02T01:40:47.716Z'),
                    doctor: { name: 'Jane', surname: 'Smith' },
                    hospital: { name: 'Green Hospital' },
                    polyclinic: { name: 'Neurology' }
                },
                {
                    date: new Date('2025-01-05T01:40:47.716Z'),
                    doctor: { name: 'Emily', surname: 'Clark' },
                    hospital: { name: 'Downtown Hospital' },
                    polyclinic: { name: 'Dermatology' }
                }
            ];

            const populateStub = jest.fn().mockResolvedValue({
                appointments: mockAppointments
            });

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: populateStub
            });

            await getPatientHome(req, res);

            const expectedUpcoming = [
                mockAppointments[2],  // Emily Clark (Jan 5)
                mockAppointments[0]   // John Doe (Jan 4)
            ];
            const expectedRecent = [
                mockAppointments[1]   // Jane Smith (Jan 2)
            ];

            expect(Patient.findById).toHaveBeenCalledWith('patient123');
            expect(res.json).toHaveBeenCalledWith({
                upcomingAppointments: expectedUpcoming,
                recentAppointments: expectedRecent
            });
        });

        it('should return empty arrays when patient has no appointments', async () => {
            const req = { user: { id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            const populateStub = jest.fn().mockResolvedValue({
                appointments: []
            });

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: populateStub
            });

            await getPatientHome(req, res);

            expect(res.json).toHaveBeenCalledWith({
                upcomingAppointments: [],
                recentAppointments: []
            });
        });

        it('should return 404 if patient is not found', async () => {
            const req = { user: { id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            const populateStub = jest.fn().mockResolvedValue(null);

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: populateStub
            });

            await getPatientHome(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
        });

        it('should handle database errors correctly', async () => {
            const req = { user: { id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            const error = new Error('Database error');
            const populateStub = jest.fn().mockRejectedValue(error);

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: populateStub
            });

            // Mock console.error to avoid cluttering test output
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await getPatientHome(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Server Error');

            consoleSpy.mockRestore();
        });

        it('should handle appointments exactly at current time', async () => {
            const req = { user: { id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            const currentTimeAppointment = {
                date: mockDate,
                doctor: { name: 'John', surname: 'Doe' },
                hospital: { name: 'City Hospital' },
                polyclinic: { name: 'Cardiology' }
            };

            const populateStub = jest.fn().mockResolvedValue({
                appointments: [currentTimeAppointment]
            });

            Patient.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                populate: populateStub
            });

            await getPatientHome(req, res);

            expect(res.json).toHaveBeenCalledWith({
                upcomingAppointments: [],
                recentAppointments: []
            });
        });
    });
});