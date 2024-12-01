import Patient from '../../models/patient.model.js';

const getLabTests = async (req, res) => {
    try {
        const labTests = await Patient.findById(req.user._id)
            .select('-_id labtests')
            .where('labtests')
            .elemMatch({ testtype: 'lab' });
        return res.status(200).json({ message: 'Test results retrieved successfully', labTests });
    } catch (error) {
        return res.status(500).json({ message: "patient.getTestResults: " + error.message });
    }
}

const getOtherTests = async (req, res) => {
    try {
        const otherTests = await Patient.findById(req.user._id)
            .select('-_id labtests')
            .where('labtests')
            .elemMatch({ testtype: 'other' });
        return res.status(200).json({ message: 'Test results retrieved successfully', otherTests });
    } catch (error) {
        return res.status(500).json({ message: "patient.getTestResults: " + error.message });
    }
}

const getDiagnoses = async (req, res) => {
    try {
        const diagnoses = await Patient.findById(req.user._id)
            .select('-_id diagnoses');
        return res.status(200).json({ message: 'Diagnoses retrieved successfully', diagnoses });
    } catch (error) {
        return res.status(500).json({ message: "patient.getDiagnoses: " + error.message });
    }
}

export { getLabTests, getOtherTests, getDiagnoses };

