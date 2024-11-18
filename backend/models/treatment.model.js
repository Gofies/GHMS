import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
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
        required: true
    },
    polyclinic: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
        required: true
    },
    treatmentdetails: {
        type: String,
        required: true
    },
    treatmentoutcome: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Treatment = mongoose.model('Treatment', treatmentSchema);

export default Treatment;