import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from '../../../models/doctor.model.js';
import Appointment from '../../../models/appointment.model.js';
import LabTest from '../../../models/lab.test.model.js';
import { getDoctorHome } from '../../../controllers/doctor.controllers/home.controller.js';

import { mockRequest, mockResponse } from 'jest-mock-req-res';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Doctor Home Controller - getDoctorHome', () => {
    beforeAll(async () => {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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

    test('should fetch today\'s appointments and recent lab results successfully', async () => {
        // Setup data
        const doctorId = new mongoose.Types.ObjectId();
        const patientId = new mongoose.Types.ObjectId();
        const appointmentId = new mongoose.Types.ObjectId();
    
        const today = new Date();
        const labTestData = {
            _id: new mongoose.Types.ObjectId(),
            patient: patientId,
            doctor: doctorId,
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: new mongoose.Types.ObjectId(),
            testtype: 'Blood Test',
            status: 'completed',
            result: 'Normal',
            resultdate: today,
        };
    
        const labTest = await LabTest.create(labTestData);
    
        const appointmentData = {
            _id: appointmentId,
            doctor: doctorId,
            patient: patientId,
            date: today,
            time: '10:00 AM',
            status: 'Scheduled',
            type: 'consultation',
            tests: [labTest._id],
        };
    
        await Appointment.create(appointmentData);
    
        const doctorData = {
            _id: doctorId,
            name: 'John',
            surname: 'Doe',
            title: 'Dr.',
            email: 'johndoe@example.com',
            password: 'securepassword',
            birthdate: new Date('1980-01-01'),
            phone: '1234567890',
            jobstartdate: new Date('2010-01-01'),
            degree: 'MD',
            specialization: 'Cardiology',
            role: 'doctor',
            appointments: [appointmentId],
        };
    
        await Doctor.create(doctorData);
    
        // Mock request and response
        const req = mockRequest({
            user: { id: doctorId },
        });
        const res = mockResponse();
    
        // Call the controller method
        await getDoctorHome(req, res);
    
        // Verify response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Doctor home data retrieved successfully',
                todaysAppointments: expect.any(Array),
                recentLabResults: expect.any(Array),
            })
        );
    
        const responseData = res.json.mock.calls[0][0];
    
        // Validate today's appointments
        expect(responseData.todaysAppointments).toHaveLength(1);
        expect(responseData.todaysAppointments[0]._id.toString()).toBe(appointmentId.toString());
    
        // Validate recent lab results
        expect(responseData.recentLabResults).toHaveLength(1);
        expect(responseData.recentLabResults[0]._id).not.toBe(labTest._id);
    });

    test('should return 404 if the doctor is not found', async () => {
        const req = mockRequest({ user: { id: new mongoose.Types.ObjectId() } });
        const res = mockResponse();

        await getDoctorHome(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
    });
});
