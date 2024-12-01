import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    emergencycontact: {
        type: String,
    },
    birthdate: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    labtests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTest',
        required: true
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    }],
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
        required: true
    }],
    diagnoses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diagnosis',
    }],
    family: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
    }],
    weight: {
        type: Number,
    },
    height: {
        type: Number,
    },
    bloodpressure: {
        type: String,
    },
    bloodsugar: {
        type: Number,
    },
    bloodtype: {
        type: String,
    },
    allergies: [{
        type: String,
    }],
    heartrate: {
        type: Number,
    },
    role: {
        type: String,
        required: true
    },

}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
