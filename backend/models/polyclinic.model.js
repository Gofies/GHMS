import mongoose from 'mongoose';

const polyclinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    }],
}, { timestamps: true });

const Polyclinic = mongoose.model('Polyclinic', polyclinicSchema);

export default Polyclinic;