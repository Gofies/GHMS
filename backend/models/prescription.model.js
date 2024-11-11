import mongoose from "mongoose";

const prescription = new mongoose.Schema({
    medicine: {
        type: Array,    // {name: "Paracetamol", quantity: "2", time: "Morning", form}, {name: "Ibuprofen", quantity: "1", time: "Afternoon"},  
        required: true
    },
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
