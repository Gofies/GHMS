import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    establishmentdate: {
        type: Date,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    polyclinics: [{
        type: mongoose.Schema.Types.ObjectId,// global poliklinik arrayi oluştur
        ref: 'Polyclinic',
        required: true
    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    }],
    labTechnicians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTechnician',
        required: true
    }],
    itTechnicians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItTechnician',
        required: true
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    }],
}, { timestamps: true });

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;