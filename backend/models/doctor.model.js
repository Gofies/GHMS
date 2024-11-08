import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
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
    degree: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
    },
    appointments: {
        type: Array,
        required: true
    },
    role: {
        type: String,
        required: true
    },

}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;

