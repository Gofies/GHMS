import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Polyclinic from '../../models/polyclinic.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Polyclinic Model', () => {
    beforeAll(async () => {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.polyclinics) {
            await mongoose.connection.collections.polyclinics.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should create and save a polyclinic successfully', async () => {
        const polyclinicData = {
            name: 'Cardiology',
            hospital: new mongoose.Types.ObjectId(),
            doctors: [new mongoose.Types.ObjectId()],
        };

        const polyclinic = new Polyclinic(polyclinicData);
        const savedPolyclinic = await polyclinic.save();

        expect(savedPolyclinic._id).toBeDefined();
        expect(savedPolyclinic.name).toBe(polyclinicData.name);
        expect(savedPolyclinic.doctors.length).toBe(1);
    });

    test('should fail validation if required fields are missing', async () => {
        const polyclinicData = {
            doctors: [new mongoose.Types.ObjectId()],
        };

        const polyclinic = new Polyclinic(polyclinicData);

        let error;
        try {
            await polyclinic.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
        expect(error.errors.name).toBeDefined();
        expect(error.errors.hospital).toBeDefined();
    });

    test('should update an existing polyclinic successfully', async () => {
        const polyclinicData = {
            name: 'Cardiology',
            hospital: new mongoose.Types.ObjectId(),
            doctors: [new mongoose.Types.ObjectId()],
        };

        const polyclinic = new Polyclinic(polyclinicData);
        const savedPolyclinic = await polyclinic.save();

        savedPolyclinic.name = 'Neurology';
        const updatedPolyclinic = await savedPolyclinic.save();

        expect(updatedPolyclinic.name).toBe('Neurology');
    });

    test('should delete a polyclinic successfully', async () => {
        const polyclinicData = {
            name: 'Cardiology',
            hospital: new mongoose.Types.ObjectId(),
            doctors: [new mongoose.Types.ObjectId()],
        };

        const polyclinic = new Polyclinic(polyclinicData);
        const savedPolyclinic = await polyclinic.save();

        await Polyclinic.findByIdAndDelete(savedPolyclinic._id);

        const foundPolyclinic = await Polyclinic.findById(savedPolyclinic._id);
        expect(foundPolyclinic).toBeNull();
    });
});
