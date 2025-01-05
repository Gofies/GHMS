import Patient from '../../models/patient.model.js';

const getLabTests = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id)
            .select('labtests')
            .populate({
                path: 'labtests', 
                select: 'testType status doctor hospital result resultdate createdAt', 
                populate: [
                    {
                        path: 'doctor',
                        select: 'name surname'
                    },
                    {
                        path: 'hospital', 
                        select: 'name'
                    }
                ]
            });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.status(200).json({
            message: 'Lab tests retrieved successfully',
            labTests: patient.labtests 
        });
    } catch (error) {
        return res.status(500).json({ message: "patient.getLabTests: " + error.message });
    }
};

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

