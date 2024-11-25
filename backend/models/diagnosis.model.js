import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
    condition: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
        required: true
    }],
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true });

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

export default Diagnosis;