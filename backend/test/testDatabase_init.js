import mongoose from 'mongoose';
import Admin from '../models/admin.model.js';
import Appointment from '../models/appointment.model.js';
import Diagnosis from '../models/diagnosis.model.js';
import Doctor from '../models/doctor.model.js';
import Hospital from '../models/hospital.model.js';
import LabTechnician from '../models/lab.technician.model.js';
import LabTest from '../models/lab.test.model.js';
import Patient from '../models/patient.model.js';
import Polyclinic from '../models/polyclinic.model.js';
import Prescription from '../models/prescription.model.js';
import Treatment from '../models/treatment.model.js';

const DATABASE_URI = 'mongodb://topsecretusername:verysecurepassword@router01:27117/TestHospitalDatabase?authSource=admin';

const initializeTestDatabase = async () => {
    try {
        // Connect to the test database
        await mongoose.connect(DATABASE_URI);
        console.log('Connected to TestHospitalDatabase');

        // Drop existing database
        await mongoose.connection.db.dropDatabase();
        console.log('Test database dropped successfully');

        // Create collections
        await Promise.all([
            Admin.createCollection(),
            Appointment.createCollection(),
            Diagnosis.createCollection(),
            Doctor.createCollection(),
            Hospital.createCollection(),
            LabTechnician.createCollection(),
            LabTest.createCollection(),
            Patient.createCollection(),
            Polyclinic.createCollection(),
            Prescription.createCollection(),
            Treatment.createCollection(),
        ]);

        console.log('All collections initialized successfully');

        // Disconnect from the database
        await mongoose.disconnect();
        console.log('Disconnected from TestHospitalDatabase');
    } catch (error) {
        console.error('Error initializing test database:', error);
        process.exit(1);
    }
};

initializeTestDatabase();
