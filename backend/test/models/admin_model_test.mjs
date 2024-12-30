import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../../models/admin.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Admin Model', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.admins) {
            await mongoose.connection.collections.admins.deleteMany({});
        }
    });

    afterAll(async () => {
            await mongoose.connection.close();
    });

    it('should throw validation error if required fields are missing', async () => {
        const admin = new Admin({});
        try {
            await admin.validate();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors['name']).toBeDefined();
            expect(error.errors['surname']).toBeDefined();
            expect(error.errors['email']).toBeDefined();
            expect(error.errors['password']).toBeDefined();
            expect(error.errors['phone']).toBeDefined();
            expect(error.errors['role']).toBeDefined();
        }
    });

    it('should create an admin successfully with valid data', async () => {
        const admin = new Admin({
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            password: 'securepassword',
            phone: '1234567890',
            role: 'admin',
        });

        const validationError = await admin.validate();
        expect(validationError).toBeUndefined();

        // Check that fields are set correctly
        expect(admin.name).toBe('John');
        expect(admin.surname).toBe('Doe');
        expect(admin.email).toBe('john.doe@example.com');
        expect(admin.password).toBe('securepassword');
        expect(admin.phone).toBe('1234567890');
        expect(admin.role).toBe('admin');
    });

    it('should add timestamps by default', async () => {
        const admin = new Admin({
            name: 'Jane',
            surname: 'Doe',
            email: 'jane.doe@example.com',
            password: 'securepassword',
            phone: '0987654321',
            role: 'admin',
        });

        const savedAdmin = await admin.save();

        expect(savedAdmin.createdAt).toBeDefined();
        expect(savedAdmin.updatedAt).toBeDefined();
    });

    it('should reject invalid email format', async () => {
        const admin = new Admin({
            name: 'Invalid',
            surname: 'Email',
            email: 'invalid-email',
            password: 'securepassword',
            phone: '1234567890',
            role: 'admin',
        });

        try {
            await admin.validate();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors['email']).toBeDefined();
        }
    });

    it('should confirm timestamps are enabled', () => {
        expect(Admin.schema.options.timestamps).toBe(true);
    });
    
});
