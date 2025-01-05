import Patient from '../../models/patient.model.js';
import bcryptjs from 'bcryptjs';

const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({}, 'name surname email');
        
        return res.status(200).json({
            message: 'Patients retrieved successfully',
            patients
        });
    } catch (error) {
        return res.status(500).json({ message: "admin.getPatients: " + error.message });
    }
};

export { getPatients };