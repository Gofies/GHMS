import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    labTechnician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTechnician',
        required: true
    },
    testType: {
        type: String,
    },
    resultdate: {
        type: Date,
    },
    result: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    urgency: {
        type: String,
    },
}, { timestamps: true });

const LabTest = mongoose.model('LabTest', labTestSchema);

export default LabTest;