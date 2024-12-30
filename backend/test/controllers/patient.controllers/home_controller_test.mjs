import { getPatientHome } from '../../../controllers/patient.controllers/home.controller.js';
import Patient from '../../../models/patient.model.js';

jest.mock('../../../models/patient.model.js');

describe('Patient Controller - getPatientHome', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return upcoming and recent appointments', async () => {
        const req = { user: { id: 'patient123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        const mockAppointments = [
            {
                date: new Date(Date.now() + 86400000), // Future date
                doctor: { name: 'John', surname: 'Doe' },
                hospital: { name: 'City Hospital' },
                polyclinic: { name: 'Cardiology' }
            },
            {
                date: new Date(Date.now() - 86400000), // Past date
                doctor: { name: 'Jane', surname: 'Smith' },
                hospital: { name: 'Green Hospital' },
                polyclinic: { name: 'Neurology' }
            }
        ];

        // Mocking the chainable Mongoose methods (select and populate)
        Patient.findById.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue({ appointments: mockAppointments })
        });

        await getPatientHome(req, res);

        expect(Patient.findById).toHaveBeenCalledWith('patient123');
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle error if patient is not found', async () => {
        const req = { user: { id: 'patient123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        // Simulate patient not found by returning null on exec
        Patient.findById.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(null)
        });

        await getPatientHome(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server Error');
    });

    it('should handle server errors gracefully', async () => {
        const req = { user: { id: 'patient123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        // Simulate database error by rejecting the promise
        Patient.findById.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockRejectedValue(new Error('Database Error'))
        });

        await getPatientHome(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server Error');
    });
});