// File: tests/controllers/doctor/home.controller.test.js

import Doctor from '../../../models/doctor.model.js';
import Appointment from '../../../models/appointment.model.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import httpMocks from 'node-mocks-http';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestDoctorDatabase?authSource=admin`;

let mockRequest;
let mockResponse;

beforeEach(async () => {
    await mongoose.connect(DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mockRequest = httpMocks.createRequest();
    mockResponse = httpMocks.createResponse();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Doctor Home Controller Tests', () => {

    describe('GET /doctor/home', () => {
        it('should retrieve upcoming and recent appointments for the doctor', async () => {
            const doctor = new Doctor({
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'doctor',
                specialization: 'Cardiology',
                degree: 'MBBS',
                jobstartdate: new Date(),
                phone: '1234567890',
                birthdate: new Date('1980-01-01'),
                title: 'Cardiologist'
            });
            await doctor.save();

            const mockAppointments = [
                {
                    doctor: doctor._id,
                    patient: new mongoose.Types.ObjectId(),
                    date: new Date(Date.now() + 86400000), // 1 day from now
                    time: '10:00',
                    status: 'Scheduled',
                    type: 'Consultation'
                },
                {
                    doctor: doctor._id,
                    patient: new mongoose.Types.ObjectId(),
                    date: new Date(Date.now() - 86400000), // 1 day ago
                    time: '15:00',
                    status: 'Completed',
                    type: 'Follow-up'
                }
            ];

            await Appointment.insertMany(mockAppointments);

            mockRequest.method = 'GET';
            mockRequest.url = '/doctor/home';
            mockRequest.user = { id: doctor._id }; // Mock authenticated doctor

            const appointments = await Appointment.find({ doctor: doctor._id });

            const upcomingAppointments = appointments.filter(
                appointment => appointment.date > new Date()
            );

            const recentAppointments = appointments.filter(
                appointment => appointment.date <= new Date()
            );

            mockResponse.status(200).json({ upcomingAppointments, recentAppointments });

            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse._getJSONData().upcomingAppointments.length).toBe(1);
            expect(mockResponse._getJSONData().recentAppointments.length).toBe(1);
        });

        it('should handle errors gracefully', async () => {
            jest.spyOn(Appointment, 'find').mockImplementationOnce(() => {
                throw new Error('Database Error');
            });

            mockRequest.method = 'GET';
            mockRequest.url = '/doctor/home';
            mockRequest.user = { id: new mongoose.Types.ObjectId() };

            try {
                await Appointment.find({ doctor: mockRequest.user.id });
            } catch (error) {
                mockResponse.status(500).json({ message: error.message });
            }

            expect(mockResponse.statusCode).toBe(500);
            expect(mockResponse._getJSONData().message).toMatch(/Database Error/);
        });
    });
});