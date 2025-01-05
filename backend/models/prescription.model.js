import mongoose from "mongoose";

const prescription = new mongoose.Schema({
    medicine: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: String,
                required: true,
            },
            time: {
                type: String,
                required: true,
            },
            form: {
                type: String,
            }
        }
    ],
    status: {
        type: String,
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    doctor: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescription);

export default Prescription;
