import mongoose from 'mongoose';
import {
    getPatients,
    getPatient,
    createPrescription,
    updatePrescription,
    deletePrescription,
    getLabTechniciansBySpecialization,
    newLabTestRequest
} from 'backend/controllers/doctor.controllers/patient.controller.js';
import Doctor from '../../../models/doctor.model.js';
import Patient from '../../../models/patient.model.js';
import Hospital from '../../../models/hospital.model.js';
import Prescription from '../../../models/prescription.model.js';
import LabTechnician from '../../../models/lab.technician.model.js';
import Polyclinic from '../../../models/polyclinic.model.js';
import Appointment from '../../../models/appointment.model.js';
import dotenv from 'dotenv';
import httpMocks from 'node-mocks-http';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestDoctorDatabase?authSource=admin`;

describe('Patient Controller Tests', () => {
    let mockRequest;
    let mockResponse;
    let testDoctor;
    let testPatient;
    let testHospital;
    let testPolyclinic;
    let testAppointment;
    let testPrescription;
    let testLabTechnician;
    let testLabTest;

    beforeEach(async () => {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create test hospital
        testHospital = await Hospital.create({
            name: 'Test Hospital',
            address: 'Test Address',
            establishmentdate: new Date('2020-01-01'),
            phone: '1234567890',
            email: 'test@hospital.com',
            polyclinics: [],
            doctors: [],
            labTechnicians: [],
            itTechnicians: [],
            appointments: [],
            labTests: []
        });

        // Create test polyclinic
        testPolyclinic = await Polyclinic.create({
            name: 'Test Polyclinic',
            hospital: testHospital._id,
            doctors: []
        });

        // Create test doctor
        testDoctor = await Doctor.create({
            name: 'Test',
            surname: 'Doctor',
            title: 'Dr.',
            email: 'test@doctor.com',
            password: 'password123',
            birthdate: new Date('1980-01-01'),
            phone: '1234567890',
            jobstartdate: new Date('2010-01-01'),
            degree: 'MD',
            specialization: 'General',
            hospital: testHospital._id,
            polyclinic: testPolyclinic._id,
            appointments: [],
            labtests: [],
            role: 'doctor',
            schedule: []
        });

        // Create test patient
        testPatient = await Patient.create({
            name: 'Test',
            surname: 'Patient',
            gender: 'Male',
            email: 'test@patient.com',
            password: 'password123',
            phone: '1234567890',
            emergencycontact: '0987654321',
            birthdate: new Date('1990-01-01'),
            nationality: 'Test',
            address: 'Test Address',
            labtests: [],
            appointments: [],
            prescriptions: [],
            diagnoses: [],
            family: [],
            weight: 70,
            height: 175,
            bloodpressure: '120/80',
            bloodsugar: 100,
            bloodtype: 'A+',
            allergies: ['Peanuts'],
            heartrate: 72,
            role: 'patient'
        });

        testAppointment = await Appointment.create({
            patient: testPatient._id,
            doctor: testDoctor._id,
            hospital: testHospital._id,
            polyclinic: testPolyclinic._id,
            date: new Date('2025-01-15'),
            time: '09:00',
            status: 'scheduled',
            type: 'consultation'
        });


        // Update relationships
        testDoctor.appointments.push(testAppointment._id);
        testPatient.appointments.push(testAppointment._id);
        testHospital.appointments.push(testAppointment._id);
        await testDoctor.save();
        await testPatient.save();
        await testHospital.save();

        // Create test lab technician
        testLabTechnician = await LabTechnician.create({
            name: 'Test',
            surname: 'Technician',
            title: 'Lab Tech',
            email: 'test@tech.com',
            password: 'password123',
            birthdate: new Date('1985-01-01'),
            phone: '1234567890',
            jobstartdate: new Date('2015-01-01'),
            specialization: 'Blood',
            certificates: ['Medical Lab Certificate', 'Blood Analysis Specialist'],
            hospital: testHospital._id,
            role: 'labTechnician'
        });

        // Create test prescription
        testPrescription = await Prescription.create({
            medicine: [{
                name: 'Test Medicine',
                quantity: '1 tablet',
                time: 'morning',
                form: 'tablet'
            }],
            status: 'active',
            hospital: testHospital._id,
            doctor: testDoctor._id
        });

        testPatient.prescriptions.push(testPrescription._id);
        await testPatient.save();

        mockRequest = httpMocks.createRequest();
        mockResponse = httpMocks.createResponse();
    });

    afterEach(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('getPatients', () => {
        it('should get all patients for doctor', async () => {
            mockRequest.user = { _id: testDoctor._id };

            await getPatients(mockRequest, mockResponse);

            const responseData = mockResponse._getJSONData();
            expect(mockResponse._getStatusCode()).toBe(200);
            expect(responseData.patients).toBeInstanceOf(Array);
            expect(responseData.patients.length).toBe(1);
            expect(responseData.patients[0].name).toBe('Test');
            expect(responseData.patients[0].surname).toBe('Patient');
        });

        it('should handle empty patient list', async () => {
            await Appointment.deleteMany({});
            testDoctor.appointments = [];
            await testDoctor.save();

            mockRequest.user = { _id: testDoctor._id };

            await getPatients(mockRequest, mockResponse);

            const responseData = mockResponse._getJSONData();
            expect(mockResponse._getStatusCode()).toBe(200);
            expect(responseData.patients).toBeInstanceOf(Array);
            expect(responseData.patients.length).toBe(0);
        });
    });

    describe('getPatient', () => {
        it('should get detailed patient information', async () => {
            mockRequest.user = { _id: testDoctor._id };
            mockRequest.params = { patientId: testPatient._id };

            await getPatient(mockRequest, mockResponse);

            const responseData = mockResponse._getJSONData();
            expect(mockResponse._getStatusCode()).toBe(200);
            expect(responseData.patient._id.toString()).toBe(testPatient._id.toString());
            expect(responseData.patient.name).toBe('Test');
            expect(responseData.patient.surname).toBe('Patient');
            expect(responseData.message).toBe('Patient retrieved successfully');
        });

        it('should return 404 if doctor or hospital not found', async () => {
            mockRequest.user = { _id: new mongoose.Types.ObjectId() };
            mockRequest.params = { patientId: testPatient._id };

            await getPatient(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(404);
            expect(mockResponse._getJSONData().message).toBe('Doctor or hospital not found.');
        });
    });

    describe('createPrescription', () => {
        it('should create prescription successfully', async () => {
            mockRequest.params = { patientId: testPatient._id };
            mockRequest.user = { _id: testDoctor._id };
            mockRequest.body = {
                medicine: [{
                    name: 'New Medicine',
                    quantity: '2 tablets',
                    time: 'evening',
                    form: 'tablet'
                }],
                status: 'active'
            };

            await createPrescription(mockRequest, mockResponse);

            const responseData = mockResponse._getJSONData();
            expect(mockResponse._getStatusCode()).toBe(201);
            expect(responseData.prescription.medicine[0].name).toBe('New Medicine');
            expect(responseData.prescription.status).toBe('active');
            expect(responseData.message).toBe('Prescription created successfully');
        });

        it('should return 403 if doctor is not authorized', async () => {
            const unauthorizedDoctor = await Doctor.create({
                name: 'Unauthorized',
                surname: 'Doctor',
                title: 'Dr.',
                email: 'unauth@doctor.com',
                password: 'password123',
                birthdate: new Date('1980-01-01'),
                phone: '1234567890',
                jobstartdate: new Date('2010-01-01'),
                degree: 'MD',
                specialization: 'General',
                hospital: testHospital._id,
                role: 'doctor'
            });

            mockRequest.params = { patientId: testPatient._id };
            mockRequest.user = { _id: unauthorizedDoctor._id };
            mockRequest.body = {
                medicine: [{
                    name: 'Test Medicine',
                    quantity: '1',
                    time: 'morning',
                    form: 'tablet'
                }],
                status: 'active'
            };

            await createPrescription(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(403);
            expect(mockResponse._getJSONData().message).toBe('You are not authorized to create a prescription for this patient.');
        });
    });

    describe('updatePrescription', () => {
        it('should update prescription successfully', async () => {
            mockRequest.params = { prescriptionId: testPrescription._id };
            mockRequest.body = {
                medicine: [{
                    name: 'Updated Medicine',
                    quantity: '3 tablets',
                    time: 'night',
                    form: 'tablet'
                }],
                status: 'completed'
            };

            await updatePrescription(mockRequest, mockResponse);

            const responseData = mockResponse._getJSONData();
            expect(mockResponse._getStatusCode()).toBe(200);
            expect(responseData.prescription.medicine[0].name).toBe('Updated Medicine');
            expect(responseData.prescription.status).toBe('completed');
            expect(responseData.message).toBe('Prescription updated successfully');
        });

        it('should return 404 if prescription not found', async () => {
            mockRequest.params = { prescriptionId: new mongoose.Types.ObjectId() };
            mockRequest.body = {
                medicine: [{
                    name: 'Updated Medicine',
                    quantity: '3',
                    time: 'night',
                    form: 'tablet'
                }],
                status: 'completed'
            };

            await updatePrescription(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(404);
            expect(mockResponse._getJSONData().message).toBe('Prescription not found');
        });
    });

    describe('deletePrescription', () => {
        it('should delete prescription successfully', async () => {
            mockRequest.params = { prescriptionId: testPrescription._id };

            await deletePrescription(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(200);
            expect(mockResponse._getJSONData().message).toBe('Prescription deleted successfully');

            const deletedPrescription = await Prescription.findById(testPrescription._id);
            expect(deletedPrescription).toBeNull();
        });

        it('should return 400 if prescription ID is missing', async () => {
            mockRequest.params = {};

            await deletePrescription(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(400);
            expect(mockResponse._getJSONData().message).toBe('Prescription ID is required');
        });
    });

    describe('getLabTechniciansBySpecialization', () => {
        it('should get lab technicians by specialization', async () => {
            mockRequest.user = { _id: testDoctor._id };
            mockRequest.query = { specialization: 'Blood' };

            await getLabTechniciansBySpecialization(mockRequest, mockResponse);

            const responseData = mockResponse._getJSONData();
            expect(mockResponse._getStatusCode()).toBe(200);
            expect(responseData.labTechnicians).toBeInstanceOf(Array);
            expect(responseData.labTechnicians.length).toBe(1);
            expect(responseData.labTechnicians[0].specialization).toBe('Blood');
            expect(responseData.message).toBe('Lab technicians retrieved successfully');
        });

        it('should return 404 if no lab technicians found', async () => {
            mockRequest.user = { _id: testDoctor._id };
            mockRequest.query = { specialization: 'NonExistent' };

            await getLabTechniciansBySpecialization(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(404);
            expect(mockResponse._getJSONData().message).toBe('No lab technicians found for the specified specialization');
        });
    });

    describe('newLabTestRequest', () => {
        it('should create lab test request successfully', async () => {
            mockRequest.user = { _id: testDoctor._id };
            mockRequest.body = {
                patientId: testPatient._id,
                labTechnicianId: testLabTechnician._id,
                testType: 'blood',
                urgency: 'high',
                specialization: 'Blood'
            };

            await newLabTestRequest(mockRequest, mockResponse);

            const responseData = mockResponse._getJSONData();
            expect(mockResponse._getStatusCode()).toBe(201);
            expect(responseData.labTest.testType).toBe('blood');
            expect(responseData.labTest.urgency).toBe('high');
            expect(responseData.labTest.status).toBe('pending');
            expect(responseData.message).toBe('Lab test created successfully');

            // Verify relationships were updated
            const updatedPatient = await Patient.findById(testPatient._id);
            const updatedHospital = await Hospital.findById(testHospital._id);
            const updatedDoctor = await Doctor.findById(testDoctor._id);

            expect(updatedPatient.labtests[0].toString()).toBe(responseData.labTest._id.toString());
            expect(updatedHospital.labTests[0].toString()).toBe(responseData.labTest._id.toString());
            expect(updatedDoctor.labtests[0].toString()).toBe(responseData.labTest._id.toString());
        });

        it('should return 400 if required fields are missing', async () => {
            mockRequest.user = { _id: testDoctor._id };
            mockRequest.body = {
                patientId: testPatient._id
                // Missing other required fields
            };

            await newLabTestRequest(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(400);
            expect(mockResponse._getJSONData().message).toBe('All fields are required (patientId, labTechnicianId, testType, urgency, specialization)');
        });

        it('should return 404 if lab technician not found', async () => {
            mockRequest.user = { _id: testDoctor._id };
            mockRequest.body = {
                patientId: testPatient._id,
                labTechnicianId: new mongoose.Types.ObjectId(),
                testType: 'blood',
                urgency: 'high',
                specialization: 'Blood'
            };

            await newLabTestRequest(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(404);
            expect(mockResponse._getJSONData().message).toBe('Lab technician not found');
        });

        it('should return 400 if lab technician is from different hospital', async () => {
            const differentHospital = await Hospital.create({
                name: 'Different Hospital',
                address: 'Different Address',
                establishmentdate: new Date('2020-01-01'),
                phone: '9876543210',
                email: 'different@hospital.com',
                polyclinics: [],
                doctors: [],
                labTechnicians: [],
                itTechnicians: [],
                appointments: [],
                labTests: []
            });

            const differentLabTechnician = await LabTechnician.create({
                name: 'Different',
                surname: 'Technician',
                title: 'Lab Tech',
                email: 'different@tech.com',
                password: 'password123',
                birthdate: new Date('1985-01-01'),
                phone: '9876543210',
                jobstartdate: new Date('2015-01-01'),
                specialization: 'Blood',
                certificates: ['Medical Lab Certificate'],
                hospital: differentHospital._id,
                role: 'labTechnician'
            });

            mockRequest.user = { _id: testDoctor._id };
            mockRequest.body = {
                patientId: testPatient._id,
                labTechnicianId: differentLabTechnician._id,
                testType: 'blood',
                urgency: 'high',
                specialization: 'Blood'
            };

            await newLabTestRequest(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(400);
            expect(mockResponse._getJSONData().message).toBe('Lab technician does not belong to the same hospital as the doctor');
        });

        it('should return 400 if specialization does not match', async () => {
            mockRequest.user = { _id: testDoctor._id };
            mockRequest.body = {
                patientId: testPatient._id,
                labTechnicianId: testLabTechnician._id,
                testType: 'blood',
                urgency: 'high',
                specialization: 'Radiology' // Different from lab technician's specialization
            };

            await newLabTestRequest(mockRequest, mockResponse);

            expect(mockResponse._getStatusCode()).toBe(400);
            expect(mockResponse._getJSONData().message).toBe('Lab technician specialization does not match the requested specialization');
        });
    });
});

describe('Doctor Model Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('should initialize a 14-day weekday schedule', async () => {
        const doctor = await Doctor.create({
            name: 'Test',
            surname: 'Doctor',
            title: 'Dr.',
            email: 'test@doctor.com',
            password: 'password123',
            birthdate: new Date('1980-01-01'),
            phone: '1234567890',
            jobstartdate: new Date('2010-01-01'),
            degree: 'MD',
            specialization: 'General',
            role: 'doctor',
        });

        expect(doctor.schedule).toHaveLength(14);
        doctor.schedule.forEach((day) => {
            const dayOfWeek = new Date(day.date).getDay();
            expect(dayOfWeek).toBeGreaterThanOrEqual(1); // Monday
            expect(dayOfWeek).toBeLessThanOrEqual(5); // Friday
            expect(day.timeSlots).toHaveLength(9); // 08:00 to 16:00
        });
    });

    it('should update the schedule by removing old days and adding new ones', async () => {
        const doctor = await Doctor.create({
            name: 'Test',
            surname: 'Doctor',
            title: 'Dr.',
            email: 'test@doctor.com',
            password: 'password123',
            birthdate: new Date('1980-01-01'),
            phone: '1234567890',
            jobstartdate: new Date('2010-01-01'),
            degree: 'MD',
            specialization: 'General',
            role: 'doctor',
        });

        // Manually set a past date for the first day in the schedule
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1); // Yesterday
        doctor.schedule[0].date = pastDate;
        await doctor.save();

        // Call updateSchedule and verify
        await doctor.updateSchedule();

        expect(doctor.schedule).toHaveLength(14);
        const firstDate = new Date(doctor.schedule[0].date);
        expect(firstDate.getDate()).toBeGreaterThan(new Date().getDate()); // Ensure it's a future date
        doctor.schedule.forEach((day) => {
            const dayOfWeek = new Date(day.date).getDay();
            expect(dayOfWeek).toBeGreaterThanOrEqual(1); // Monday
            expect(dayOfWeek).toBeLessThanOrEqual(5); // Friday
            expect(day.timeSlots).toHaveLength(9); // 08:00 to 16:00
        });
    });
});