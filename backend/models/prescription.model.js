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
                type: String, // Optional if `form` is not always required
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
    doctor: { // Reçeteyi yazan doktor
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Doctor modeline referans
        required: true
    },
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescription);

export default Prescription;
