import mongoose from 'mongoose';

const labTechnicianSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    jobstartdate: {
        type: Date,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    certificates: {
        type: Array,
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
    },
    role: {
        type: String,
        required: true
    },
}, { timestamps: true });

const LabTechnician = mongoose.model('LabTechnician', labTechnicianSchema);

export default LabTechnician;