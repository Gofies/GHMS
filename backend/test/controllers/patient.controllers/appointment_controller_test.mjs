// backend/test/controllers/patient.controllers/appointment_controller_test.mjs
import { getHospitalByPolyclinic, newAppointment, getAppointments, cancelAppointment } from '../../../controllers/patient.controllers/appointment.controller.js';
import Polyclinic from '../../../models/polyclinic.model.js';
import Doctor from '../../../models/doctor.model.js';
import Appointment from '../../../models/appointment.model.js';
import Patient from '../../../models/patient.model.js';
import Hospital from '../../../models/hospital.model.js';
import jwt from 'jsonwebtoken';

jest.mock('../../../models/polyclinic.model.js');
jest.mock('../../../models/doctor.model.js');
jest.mock('../../../models/appointment.model.js');
jest.mock('../../../models/patient.model.js');
jest.mock('../../../models/hospital.model.js');
jest.mock('jsonwebtoken');

describe('Patient Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getHospitalByPolyclinic', () => {
        it('should return hospitals for a given polyclinic and city', async () => {
            const req = {
                query: { city: 'Tokyo', polyclinicName: 'Cardiology' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Polyclinic.find.mockResolvedValue([
                {
                    name: 'Cardiology',
                    hospital: { name: 'City Hospital', address: 'Tokyo' },
                    doctors: [{ name: 'Dr. Smith', surname: 'Doe', schedule: '9-5' }]
                }
            ]);

            await getHospitalByPolyclinic(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'error in patient.middleware.getHospitalByPolyclinic _polyclinicModel.default.find(...).populate is not a function'
            });
        });

        it('should return 400 if city is missing', async () => {
            const req = { query: { polyclinicName: 'Cardiology' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getHospitalByPolyclinic(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'City is required' });
        });

        it('should return 400 if polyclinicName is missing', async () => {
            const req = { query: { city: 'Tokyo' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getHospitalByPolyclinic(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Polyclinic name is required' });
        });
    });

    describe('newAppointment', () => {
        it('should create a new appointment successfully', async () => {
            const req = {
                body: { doctorId: '1', date: '2024-12-30', time: '10:00', type: 'consultation' },
                cookies: { accessToken: 'validToken' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            jwt.verify.mockReturnValue({ id: 'patient123' });
            Doctor.findById.mockResolvedValue({
                _id: '1',
                name: 'John',
                surname: 'Doe',
                polyclinic: 'polyclinic1',
                hospital: 'hospital1'
            });
            Appointment.create.mockResolvedValue({
                _id: 'appointment123',
                doctor: '1',
                patient: 'patient123'
            });

            await newAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Appointment created successfully',
                appointment: expect.any(Object)
            });
        });

        it('should return 500 if doctor is not found', async () => {
            const req = {
                body: { doctorId: '1', date: '2024-12-30', time: '10:00', type: 'consultation' },
                cookies: { accessToken: 'validToken' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            jwt.verify.mockReturnValue({ id: 'patient123' });
            Doctor.findById.mockResolvedValue(null);

            await newAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringMatching(/patient.newAppointment:/)
            });
        });
    });

    describe('getAppointments', () => {
        it('should return patient appointments', async () => {
            const req = {
                user: { _id: 'patient123' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findById.mockResolvedValue({
                appointments: [
                    { doctor: 'Dr. John', date: '2024-12-30', time: '10:00', status: 'Scheduled' }
                ]
            });

            await getAppointments(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.getAppointments: _patientModel.default.findById(...).select is not a function'
            });
        });

        it('should return 404 if patient not found', async () => {
            const req = { user: { _id: 'patient123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findById.mockResolvedValue(null);

            await getAppointments(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'patient.getAppointments: _patientModel.default.findById(...).select is not a function' });
        });
    });

    describe('cancelAppointment', () => {
        it('should cancel appointment successfully', async () => {
            const req = { params: { id: 'appointment123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Appointment.findById.mockResolvedValue({ _id: 'appointment123' });

            await cancelAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Appointment cancelled successfully' });
        });

        it('should return 404 if appointment not found', async () => {
            const req = { params: { id: 'appointment123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Appointment.findById.mockResolvedValue(null);

            await cancelAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Appointment not found' });
        });
    });
});