import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LabTest from '../../models/lab.test.model.js';
import LabTechnician from '../../models/lab.technician.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('LabTest Model', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.labtests) {
            await mongoose.connection.collections.labtests.deleteMany({});
        }
        if (mongoose.connection.collections.labtechnicians) {
            await mongoose.connection.collections.labtechnicians.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should throw a validation error if required fields are missing', async () => {
        const labTest = new LabTest({}); // Missing all required fields

        try {
            await labTest.validate();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors['patient']).toBeDefined();
            expect(error.errors['doctor']).toBeDefined();
            expect(error.errors['hospital']).toBeDefined();
            expect(error.errors['polyclinic']).toBeDefined();
            expect(error.errors['labTechnician']).toBeDefined();
        }
    });

    it('should set default values correctly', async () => {
        // Create a LabTechnician
        const labTechnician = new LabTechnician({
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            password: 'securepassword',
            phone: '1234567890',
            role: 'lab_technician',
            specialization: 'Radiology',
            jobstartdate: new Date('2020-01-01'),
            birthdate: new Date('1990-01-01'),
            title: 'Technician',
        });

        const savedTechnician = await labTechnician.save();

        const labTest = new LabTest({
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: new mongoose.Types.ObjectId(),
            labTechnician: savedTechnician._id,
        });

        expect(labTest.status).toBe('pending'); // Default value
        expect(labTest.result).toBeUndefined(); // Optional field
        expect(labTest.urgency).toBeUndefined(); // Optional field
    });

    it('should accept valid input', async () => {
        // Create a LabTechnician
        const labTechnician = new LabTechnician({
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            password: 'securepassword',
            phone: '1234567890',
            role: 'lab_technician',
            specialization: 'Radiology',
            jobstartdate: new Date('2020-01-01'),
            birthdate: new Date('1990-01-01'),
            title: 'Technician',
        });

        const savedTechnician = await labTechnician.save();

        const labTest = new LabTest({
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: new mongoose.Types.ObjectId(),
            labTechnician: savedTechnician._id,
            testtype: 'lab',
            status: 'completed',
            urgency: 'high',
        });

        const savedLabTest = await labTest.save();

        expect(savedLabTest._id).toBeDefined();
        expect(savedLabTest.status).toBe('completed');
        expect(savedLabTest.urgency).toBe('high');
        expect(savedLabTest.testtype).toBe();
        expect(savedLabTest.labTechnician.toString()).toBe(savedTechnician._id.toString());
    });
});
