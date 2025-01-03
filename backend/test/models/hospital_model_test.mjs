import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from '../../models/hospital.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Hospital Model', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.hospitals) {
            await mongoose.connection.collections.hospitals.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should throw validation error if required fields are missing', async () => {
        const hospital = new Hospital({});
        try {
            await hospital.validate();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors['name']).toBeDefined();
            expect(error.errors['address']).toBeDefined();
            expect(error.errors['phone']).toBeDefined();
            expect(error.errors['establishmentdate']).toBeDefined();
        }
    });

    it('should create a hospital successfully with valid data', async () => {
        const hospital = new Hospital({
            name: 'General Hospital',
            address: '123 Test Street',
            phone: '1234567890',
            email: 'testhospital@example.com',
            establishmentdate: new Date('2000-01-01'),
        });

        const savedHospital = await hospital.save();
        expect(savedHospital.name).toBe('General Hospital');
        expect(savedHospital.address).toBe('123 Test Street');
        expect(savedHospital.phone).toBe('1234567890');
        expect(savedHospital.email).toBe('testhospital@example.com');
        expect(savedHospital.establishmentdate).toBeInstanceOf(Date);
    });

    it('should reject invalid email format', async () => {
        const hospital = new Hospital({
            name: 'City Hospital',
            address: '456 Elm Street',
            phone: '9876543210',
            email: 'invalid-email',
            establishmentdate: new Date('2005-01-01'),
        });

        try {
            await hospital.validate();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors['email']).toBeDefined();
        }
    });

    it('should allow adding a doctor to the hospital', async () => {
        const hospital = new Hospital({
            name: 'City Hospital',
            address: '456 Elm Street',
            phone: '9876543210',
            email: 'contact@cityhospital.com',
            establishmentdate: new Date('2010-05-15'),
        });

        hospital.doctors.push(new mongoose.Types.ObjectId());
        const savedHospital = await hospital.save();

        expect(savedHospital.doctors.length).toBe(1);
    });
});
