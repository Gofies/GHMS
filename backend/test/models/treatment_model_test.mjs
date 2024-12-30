import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Treatment from '../../models/treatment.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Treatment Model', () => {
    beforeAll(async () => {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.treatments) {
            await mongoose.connection.collections.treatments.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should create and save a treatment successfully', async () => {
        const treatmentData = {
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: 'Cardiology',
            diagnosis: 'Hypertension',
            prescription: new mongoose.Types.ObjectId(),
            treatmentdetails: 'Prescribed lifestyle changes and medication.',
            treatmentoutcome: 'Improved',
            time: '10:00 AM',
            status: 'active',
        };

        const treatment = new Treatment(treatmentData);
        const savedTreatment = await treatment.save();

        expect(savedTreatment._id).toBeDefined();
        expect(savedTreatment.diagnosis).toBe(treatmentData.diagnosis);
        expect(savedTreatment.status).toBe('active');
    });

    test('should fail validation if required fields are missing', async () => {
        const treatmentData = {
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            diagnosis: 'Hypertension',
            treatmentdetails: 'Prescribed lifestyle changes and medication.',
        };

        const treatment = new Treatment(treatmentData);

        let error;
        try {
            await treatment.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
        expect(error.errors.patient).toBeDefined();
        expect(error.errors.prescription).toBeDefined();
    });

    test('should update an existing treatment successfully', async () => {
        const treatmentData = {
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: 'Cardiology',
            diagnosis: 'Hypertension',
            prescription: new mongoose.Types.ObjectId(),
            treatmentdetails: 'Prescribed lifestyle changes and medication.',
            treatmentoutcome: 'Improved',
            time: '10:00 AM',
            status: 'active',
        };

        const treatment = new Treatment(treatmentData);
        const savedTreatment = await treatment.save();

        savedTreatment.status = 'completed';
        const updatedTreatment = await savedTreatment.save();

        expect(updatedTreatment.status).toBe('completed');
    });

    test('should delete a treatment successfully', async () => {
        const treatmentData = {
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: 'Cardiology',
            diagnosis: 'Hypertension',
            prescription: new mongoose.Types.ObjectId(),
            treatmentdetails: 'Prescribed lifestyle changes and medication.',
            treatmentoutcome: 'Improved',
            time: '10:00 AM',
            status: 'active',
        };

        const treatment = new Treatment(treatmentData);
        const savedTreatment = await treatment.save();

        await Treatment.findByIdAndDelete(savedTreatment._id);

        const foundTreatment = await Treatment.findById(savedTreatment._id);
        expect(foundTreatment).toBeNull();
    });
});
