import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Prescription from '../../models/prescription.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Prescription Model', () => {
    beforeAll(async () => {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.prescriptions) {
            await mongoose.connection.collections.prescriptions.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should create and save a prescription successfully', async () => {
        const prescriptionData = {
            medicine: [
                {
                    name: 'Paracetamol',
                    quantity: '10 tablets',
                    time: 'Twice a day',
                    form: 'Tablet',
                },
            ],
            status: 'active',
            doctor: new mongoose.Types.ObjectId(), // Mock doctor ID
            hospital: new mongoose.Types.ObjectId(), // Mock hospital ID
        };

        const prescription = new Prescription(prescriptionData);
        const savedPrescription = await prescription.save();

        expect(savedPrescription._id).toBeDefined();
        expect(savedPrescription.medicine.length).toBe(1);
        expect(savedPrescription.status).toBe('active');
        expect(savedPrescription.doctor).toBeDefined();
        expect(savedPrescription.hospital).toBeDefined();
    });

    test('should fail validation if required fields are missing', async () => {
        const prescriptionData = {
            medicine: [
                {
                    name: 'Paracetamol',
                    quantity: '10 tablets',
                },
            ],
        };

        const prescription = new Prescription(prescriptionData);

        let error;
        try {
            await prescription.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
        expect(error.errors['medicine.0.time']).toBeDefined();
        expect(error.errors.status).toBeDefined();
        expect(error.errors.doctor).toBeDefined();
        expect(error.errors.hospital).toBeDefined();
    });

    test('should update an existing prescription successfully', async () => {
        const prescriptionData = {
            medicine: [
                {
                    name: 'Paracetamol',
                    quantity: '10 tablets',
                    time: 'Twice a day',
                    form: 'Tablet',
                },
            ],
            status: 'active',
            doctor: new mongoose.Types.ObjectId(), // Mock doctor ID
            hospital: new mongoose.Types.ObjectId(), // Mock hospital ID
        };

        const prescription = new Prescription(prescriptionData);
        const savedPrescription = await prescription.save();

        savedPrescription.status = 'inactive';
        const updatedPrescription = await savedPrescription.save();

        expect(updatedPrescription.status).toBe('inactive');
    });

    test('should delete a prescription successfully', async () => {
        const prescriptionData = {
            medicine: [
                {
                    name: 'Paracetamol',
                    quantity: '10 tablets',
                    time: 'Twice a day',
                    form: 'Tablet',
                },
            ],
            status: 'active',
            doctor: new mongoose.Types.ObjectId(), 
            hospital: new mongoose.Types.ObjectId(), 
        };

        const prescription = new Prescription(prescriptionData);
        const savedPrescription = await prescription.save();

        await Prescription.findByIdAndDelete(savedPrescription._id);

        const foundPrescription = await Prescription.findById(savedPrescription._id);
        expect(foundPrescription).toBeNull();
    });
});
