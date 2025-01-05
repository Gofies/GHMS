import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LabTechnician from '../../models/lab.technician.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Lab Technician Model', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.labtechnicians) {
            await mongoose.connection.collections.labtechnicians.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should throw validation error if required fields are missing', async () => {
        const labTechnician = new LabTechnician({});
        try {
            await labTechnician.validate();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors['name']).toBeDefined();
            expect(error.errors['surname']).toBeDefined();
            expect(error.errors['email']).toBeDefined();
            expect(error.errors['password']).toBeDefined();
            expect(error.errors['phone']).toBeDefined();
            expect(error.errors['role']).toBeDefined();
            expect(error.errors['specialization']).toBeDefined();
            expect(error.errors['jobstartdate']).toBeDefined();
            expect(error.errors['birthdate']).toBeDefined();
            expect(error.errors['title']).toBeDefined();
        }
    });

    it('should create a lab technician successfully with valid data', async () => {
        const labTechnician = new LabTechnician({
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            password: 'securepassword',
            phone: '1234567890',
            role: 'lab_technician',
            specialization: 'Hematology',
            jobstartdate: new Date('2020-01-01'),
            birthdate: new Date('1990-01-01'),
            title: 'Technician',
        });

        const validationError = await labTechnician.validate();
        expect(validationError).toBeUndefined();

        expect(labTechnician.name).toBe('John');
        expect(labTechnician.surname).toBe('Doe');
        expect(labTechnician.email).toBe('john.doe@example.com');
        expect(labTechnician.password).toBe('securepassword');
        expect(labTechnician.phone).toBe('1234567890');
        expect(labTechnician.role).toBe('lab_technician');
    });

    it('should reject invalid email format', async () => {
        const labTechnician = new LabTechnician({
            name: 'Invalid',
            surname: 'Email',
            email: 'invalid-email',
            password: 'securepassword',
            phone: '1234567890',
            role: 'lab_technician',
            specialization: 'Hematology',
            jobstartdate: new Date('2020-01-01'),
            birthdate: new Date('1990-01-01'),
            title: 'Technician',
        });

        try {
            await labTechnician.validate();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors['email']).toBeDefined();
        }
    });
});
