import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from '../../models/patient.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Patient Model', () => {
    beforeAll(async () => {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.patients) {
            await mongoose.connection.collections.patients.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should create and save a patient successfully', async () => {
        const patientData = {
            name: 'John',
            surname: 'Doe',
            gender: 'Male',
            email: 'johndoe@example.com',
            password: 'securepassword',
            phone: '1234567890',
            emergencycontact: '0987654321',
            birthdate: new Date('1990-01-01'),
            nationality: 'American',
            address: '123 Main St',
            labtests: [],
            appointments: [],
            prescriptions: [],
            diagnoses: [],
            family: [],
            weight: 70,
            height: 180,
            bloodpressure: '120/80',
            bloodsugar: 90,
            bloodtype: 'O+',
            allergies: ['Peanuts'],
            heartrate: 72,
            role: 'patient',
        };

        const patient = new Patient(patientData);
        const savedPatient = await patient.save();

        expect(savedPatient._id).toBeDefined();
        expect(savedPatient.name).toBe(patientData.name);
        expect(savedPatient.bloodtype).toBe('O+');
    });

    test('should fail validation if required fields are missing', async () => {
        const patientData = {
            surname: 'Doe',
            gender: 'Male',
            email: 'johndoe@example.com',
            password: 'securepassword',
            phone: '1234567890',
            birthdate: new Date('1990-01-01'),
            nationality: 'American',
            role: 'patient',
        };

        const patient = new Patient(patientData);

        let error;
        try {
            await patient.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
        expect(error.errors.name).toBeDefined();
    });

    test('should update an existing patient successfully', async () => {
        const patientData = {
            name: 'John',
            surname: 'Doe',
            gender: 'Male',
            email: 'johndoe@example.com',
            password: 'securepassword',
            phone: '1234567890',
            emergencycontact: '0987654321',
            birthdate: new Date('1990-01-01'),
            nationality: 'American',
            address: '123 Main St',
            labtests: [],
            appointments: [],
            prescriptions: [],
            diagnoses: [],
            family: [],
            weight: 70,
            height: 180,
            bloodpressure: '120/80',
            bloodsugar: 90,
            bloodtype: 'O+',
            allergies: ['Peanuts'],
            heartrate: 72,
            role: 'patient',
        };

        const patient = new Patient(patientData);
        const savedPatient = await patient.save();

        savedPatient.address = '456 Another St';
        const updatedPatient = await savedPatient.save();

        expect(updatedPatient.address).toBe('456 Another St');
    });

    test('should delete a patient successfully', async () => {
        const patientData = {
            name: 'John',
            surname: 'Doe',
            gender: 'Male',
            email: 'johndoe@example.com',
            password: 'securepassword',
            phone: '1234567890',
            emergencycontact: '0987654321',
            birthdate: new Date('1990-01-01'),
            nationality: 'American',
            address: '123 Main St',
            labtests: [],
            appointments: [],
            prescriptions: [],
            diagnoses: [],
            family: [],
            weight: 70,
            height: 180,
            bloodpressure: '120/80',
            bloodsugar: 90,
            bloodtype: 'O+',
            allergies: ['Peanuts'],
            heartrate: 72,
            role: 'patient',
        };

        const patient = new Patient(patientData);
        const savedPatient = await patient.save();

        await Patient.findByIdAndDelete(savedPatient._id);

        const foundPatient = await Patient.findById(savedPatient._id);
        expect(foundPatient).toBeNull();
    });
});
