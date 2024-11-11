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
    testtype: {
        type: String,
        required: true
    },
    resultdate: {
        type: Date,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

const LabTest = mongoose.model('LabTest', labTestSchema);

export default LabTest;