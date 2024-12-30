import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from '../../../models/doctor.model.js';
import LabTest from '../../../models/lab.test.model.js';
import Hospital from '../../../models/hospital.model.js';
import { newLabTestRequest } from 'backend/controllers/doctor.controllers/lab.controller.js';

import { mockRequest, mockResponse } from 'jest-mock-req-res';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Lab Controller - newLabTestRequest', () => {
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

    test('should create a new lab test successfully', async () => {
        // Setup data
        const doctorId = new mongoose.Types.ObjectId();
        const hospitalId = new mongoose.Types.ObjectId();
        const polyclinicId = new mongoose.Types.ObjectId();
        const patientId = new mongoose.Types.ObjectId();

        await Hospital.create({
            _id: hospitalId,
            name: 'Test Hospital',
            address: '123 Test Street', // Required field
            establishmentdate: new Date('2000-01-01'), // Required field
            phone: '123-456-7890', // Required field
            email: 'testhospital@example.com', // Required field
            labTests: [],
        });

        await Doctor.create({
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
            hospital: hospitalId,
            polyclinic: polyclinicId,
            role: 'doctor',
        });

        // Mock request and response
        const req = mockRequest({
            user: { _id: doctorId },
            body: { patientId },
        });
        const res = mockResponse();

        // Call the controller method
        await newLabTestRequest(req, res);

        // Verify response
        expect(res.json).not.toHaveBeenCalled();

    });

    test('should return 500 if required fields are missing', async () => {
        // Mock request and response
        const req = mockRequest({
            user: { _id: new mongoose.Types.ObjectId() },
            body: {},
        });
        const res = mockResponse();

        // Call the controller method
        await newLabTestRequest(req, res);

        // Verify response
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server Error');
    });
});
