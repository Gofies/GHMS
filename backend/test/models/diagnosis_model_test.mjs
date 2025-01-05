import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Diagnosis from '../../models/diagnosis.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Diagnosis Model', () => {
    beforeAll(async () => {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.diagnoses) {
            await mongoose.connection.collections.diagnoses.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should create and save a diagnosis successfully', async () => {
        const diagnosisData = {
            condition: 'Hypertension',
            description: 'High blood pressure',
            prescriptions: [new mongoose.Types.ObjectId()],
            status: 'active',
            date: new Date('2024-01-15T10:00:00Z'),
        };

        const diagnosis = new Diagnosis(diagnosisData);
        const savedDiagnosis = await diagnosis.save();

        expect(savedDiagnosis._id).toBeDefined();
        expect(savedDiagnosis.condition).toBe(diagnosisData.condition);
        expect(savedDiagnosis.prescriptions.length).toBe(1);
        expect(savedDiagnosis.status).toBe('active');
    });

    test('should fail validation if required fields are missing', async () => {
        const diagnosisData = {
            description: 'High blood pressure',
            prescriptions: [new mongoose.Types.ObjectId()],
            status: 'active',
        };

        const diagnosis = new Diagnosis(diagnosisData);

        let error;
        try {
            await diagnosis.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
        expect(error.errors.condition).toBeDefined();
    });

    test('should update an existing diagnosis successfully', async () => {
        const diagnosisData = {
            condition: 'Hypertension',
            description: 'High blood pressure',
            prescriptions: [new mongoose.Types.ObjectId()],
            status: 'active',
            date: new Date('2024-01-15T10:00:00Z'),
        };

        const diagnosis = new Diagnosis(diagnosisData);
        const savedDiagnosis = await diagnosis.save();

        savedDiagnosis.status = 'resolved';
        const updatedDiagnosis = await savedDiagnosis.save();

        expect(updatedDiagnosis.status).toBe('resolved');
    });

    test('should delete a diagnosis successfully', async () => {
        const diagnosisData = {
            condition: 'Hypertension',
            description: 'High blood pressure',
            prescriptions: [new mongoose.Types.ObjectId()],
            status: 'active',
            date: new Date('2024-01-15T10:00:00Z'),
        };

        const diagnosis = new Diagnosis(diagnosisData);
        const savedDiagnosis = await diagnosis.save();

        await Diagnosis.findByIdAndDelete(savedDiagnosis._id);

        const foundDiagnosis = await Diagnosis.findById(savedDiagnosis._id);
        expect(foundDiagnosis).toBeNull();
    });
});
