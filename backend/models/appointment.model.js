import mongoose from "mongoose";

const appointment = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
    },
    polyclinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Polyclinic',
    },
    treatment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Treatment',
    }],
    type: { 
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTests'
    }],
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointment);

export default Appointment;