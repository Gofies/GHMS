import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LabTest from '../../models/lab.test.model.js';

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
        }
    });

    it('should set default values correctly', async () => {
        const labTest = new LabTest({
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: new mongoose.Types.ObjectId(),
        });

        expect(labTest.status).toBe('pending'); // Default value
        expect(labTest.result).toBeUndefined(); // Optional field
        expect(labTest.urgency).toBeUndefined(); // Optional field
    });

    it('should accept valid input', async () => {
        const labTest = new LabTest({
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: new mongoose.Types.ObjectId(),
            testtype: 'lab',
            status: 'completed',
            urgency: 'high',
        });

        const validationError = await labTest.validate();
        expect(validationError).toBeUndefined();
    });
});
