import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from '../../models/doctor.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Doctor Model', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.doctors) {
            await mongoose.connection.collections.doctors.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should throw validation error if required fields are missing', async () => {
        const doctor = new Doctor({});
        try {
            await doctor.validate();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors['name']).toBeDefined();
            expect(error.errors['surname']).toBeDefined();
            expect(error.errors['title']).toBeDefined();
            expect(error.errors['email']).toBeDefined();
            expect(error.errors['password']).toBeDefined();
            expect(error.errors['birthdate']).toBeDefined();
            expect(error.errors['phone']).toBeDefined();
            expect(error.errors['jobstartdate']).toBeDefined();
            expect(error.errors['degree']).toBeDefined();
            expect(error.errors['specialization']).toBeDefined();
            expect(error.errors['role']).toBeDefined();
        }
    });

    it('should create a doctor successfully with valid data', async () => {
        const doctor = new Doctor({
            name: 'Alice',
            surname: 'Smith',
            title: 'Dr.',
            email: 'alice.smith@example.com',
            password: 'securepassword',
            birthdate: new Date('1980-01-01'),
            phone: '1234567890',
            jobstartdate: new Date('2020-01-01'),
            degree: 'MD',
            specialization: 'Cardiology',
            role: 'doctor',
        });

        const validationError = await doctor.validate();
        expect(validationError).toBeUndefined();

        expect(doctor.name).toBe('Alice');
        expect(doctor.surname).toBe('Smith');
        expect(doctor.title).toBe('Dr.');
        expect(doctor.email).toBe('alice.smith@example.com');
        expect(doctor.password).toBe('securepassword');
        expect(doctor.birthdate).toBeInstanceOf(Date);
        expect(doctor.role).toBe('doctor');
    });

    it('should initialize a 14-day schedule with correct time slots', () => {
        const doctor = new Doctor({
            name: 'John',
            surname: 'Doe',
            title: 'Dr.',
            email: 'john.doe@example.com',
            password: 'securepassword',
            birthdate: new Date('1975-01-01'),
            phone: '1234567890',
            jobstartdate: new Date('2015-01-01'),
            degree: 'MBBS',
            specialization: 'Orthopedics',
            role: 'doctor',
        });

        expect(doctor.schedule.length).toBe(14); // 14 days
        doctor.schedule.forEach((day) => {
            expect(day.timeSlots.length).toBe(9); // 8:00 to 16:00
            day.timeSlots.forEach((slot) => {
                expect(slot.isFree).toBe(true);
                expect(slot.time).toMatch(/^\d{2}:\d{2}$/); // Format HH:MM
            });
        });
    });

    it('should update the schedule correctly using updateSchedule()', async () => {
        // Create a new doctor with an initial schedule
        const doctor = new Doctor({
            name: 'Jane',
            surname: 'Doe',
            title: 'Dr.',
            email: 'jane.doe@example.com',
            password: 'securepassword',
            birthdate: new Date('1985-05-15'),
            phone: '9876543210',
            jobstartdate: new Date('2010-05-15'),
            degree: 'MD',
            specialization: 'Pediatrics',
            role: 'doctor',
        });
    
        // Verify initial schedule length
        expect(doctor.schedule.length).toBe(14); // 14 days
    
        // Store the initial schedule for comparison
        const initialSchedule = doctor.schedule.map((day) => ({
            date: day.date.toISOString(),
            timeSlots: day.timeSlots.map((slot) => ({
                time: slot.time,
                isFree: slot.isFree,
            })),
        }));
    
        // Call the updateSchedule method to modify the schedule
        await doctor.updateSchedule();
    
        // Fetch the updated doctor from the database to ensure the schedule was saved
        const updatedDoctor = await Doctor.findById(doctor._id);
    
        // Verify that the schedule still has 14 days
        expect(updatedDoctor.schedule.length).toBe(14);
    
        // Check that the first day in the updated schedule is different (oldest day removed)
        expect(updatedDoctor.schedule[0].date.toISOString()).not.toBe(initialSchedule[0].date);
    
        // Check that a new day has been added at the end with the correct time slots
        const lastDay = updatedDoctor.schedule[13];
        expect(lastDay.timeSlots.length).toBe(9); // 8:00 to 16:00
    
        // Verify all time slots in the new day are free and correctly formatted
        lastDay.timeSlots.forEach((slot) => {
            expect(slot.isFree).toBe(true);
            expect(slot.time).toMatch(/^\d{2}:\d{2}$/); // Format HH:MM
        });
    });
});
