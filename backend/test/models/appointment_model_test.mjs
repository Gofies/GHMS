import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Appointment from '../../models/appointment.model.js';

dotenv.config({ path: '../../.env' }); // Use the shared .env file

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Appointment Model', () => {
    beforeAll(async () => {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        if (mongoose.connection.collections.appointments) {
            await mongoose.connection.collections.appointments.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should create and save an appointment successfully', async () => {
        const appointmentData = {
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: new mongoose.Types.ObjectId(),
            date: new Date('2024-01-15T10:00:00Z'),
            time: '10:00 AM',
            type: 'consultation',
            status: 'Scheduled',
        };

        const appointment = new Appointment(appointmentData);
        const savedAppointment = await appointment.save();

        expect(savedAppointment._id).toBeDefined();
        expect(savedAppointment.patient.toString()).toBe(appointmentData.patient.toString());
        expect(savedAppointment.status).toBe('Scheduled');
        expect(savedAppointment.type).toBe('consultation');
    });

    test('should fail validation if a required field is missing', async () => {
        const appointmentData = {
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: new mongoose.Types.ObjectId(),
            date: new Date('2024-01-15T10:00:00Z'),
            time: '10:00 AM',
            type: 'consultation',
        };

        const appointment = new Appointment(appointmentData);

        let error;
        try {
            await appointment.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
        expect(error.errors.patient).toBeDefined();
    });

    test('should update an existing appointment successfully', async () => {
        const appointmentData = {
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: new mongoose.Types.ObjectId(),
            date: new Date('2024-01-15T10:00:00Z'),
            time: '10:00 AM',
            type: 'consultation',
            status: 'Scheduled',
        };

        const appointment = new Appointment(appointmentData);
        const savedAppointment = await appointment.save();

        savedAppointment.status = 'completed';
        const updatedAppointment = await savedAppointment.save();

        expect(updatedAppointment.status).toBe('completed');
    });

    test('should delete an appointment successfully', async () => {
        const appointmentData = {
            patient: new mongoose.Types.ObjectId(),
            doctor: new mongoose.Types.ObjectId(),
            hospital: new mongoose.Types.ObjectId(),
            polyclinic: new mongoose.Types.ObjectId(),
            date: new Date('2024-01-15T10:00:00Z'),
            time: '10:00 AM',
            type: 'consultation',
            status: 'Scheduled',
        };

        const appointment = new Appointment(appointmentData);
        const savedAppointment = await appointment.save();

        await Appointment.findByIdAndDelete(savedAppointment._id);

        const foundAppointment = await Appointment.findById(savedAppointment._id);
        expect(foundAppointment).toBeNull();
    });
});
