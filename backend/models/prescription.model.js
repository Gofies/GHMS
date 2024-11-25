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

    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescription);

export default Prescription;
