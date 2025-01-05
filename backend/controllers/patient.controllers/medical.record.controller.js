import Patient from '../../models/patient.model.js';

const getLabTests = async (req, res) => {
    try {
        // Fetch the patient's lab tests
        const patient = await Patient.findById(req.user._id)
            .select('labtests') // Sadece labtests alanını seçiyoruz
            .populate({
                path: 'labtests', // labtests alanını dolduruyoruz
                select: 'testType status doctor hospital result resultdate createdAt', // Gerekli alanları seçiyoruz
                populate: [
                    {
                        path: 'doctor', // doctor bilgilerini doldur
                        select: 'name surname' // Sadece name ve surname
                    },
                    {
                        path: 'hospital', // hospital bilgilerini doldur
                        select: 'name' // Sadece hospital name
                    }
                ]
            });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.status(200).json({
            message: 'Lab tests retrieved successfully',
            labTests: patient.labtests // Populate edilmiş ve filtrelenmiş labtests
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

