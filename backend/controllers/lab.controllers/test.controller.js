import Doctor from "../../models/doctor.model.js";
import LabTechnician from "../../models/lab.technician.model.js";
import Hospital from "../../models/hospital.model.js";
import LabTest from "../../models/lab.test.model.js";
import Patient from "../../models/patient.model.js";

const getResults = async (req, res) => {
    try {
        const results = await LabTechnician.findById(req.user._id)
            .select('hospital')
            .populate({
                path: 'hospital',
                model: 'Hospital',
                select: 'labTests',
                populate: {
                    path: 'labTests',
                    model: 'LabTest',
                    populate: [
                        {
                            path: 'patient',
                            model: 'Patient',
                            select: 'name surname'
                        },
                        {
                            path: 'doctor',
                            model: 'Doctor',
                            select: 'name surname'
                        }
                    ]

                }

            });

        if (!results) {
            return res.status(404).json({ message: 'Results not found' });
        }

        res.json(results);

    } catch (error) {
        console.error(error, 'Error in getResults controller');
        res.status(500).send('Server Error');
    }
}

const getLabTests = async (req, res) => {
    try {
        const labTests = await LabTechnician.findById(req.user._id)
            .select('hospital')
            .populate({
                path: 'hospital',
                model: 'Hospital',
                select: 'labTests',
                populate: {
                    path: 'labTests',
                    model: 'LabTest',
                    populate: [
                        {
                            path: 'patient',
                            model: 'Patient',
                            select: 'name surname'
                        },
                        {
                            path: 'doctor',
                            model: 'Doctor',
                            select: 'name surname'
                        }
                    ]
                }
            });


        if (!labTests) {
            return res.status(404).json({ message: 'Lab tests not found' });
        }


        const pendingTests = labTests.hospital.labTests.filter(test => test.status === 'pending');
        const completedTests = labTests.hospital.labTests.filter(test => test.status === 'completed');

        res.json({ pendingTests, completedTests });

    } catch (error) {
        console.error(error, 'Error in getLabTests controller');
        res.status(500).send('Server Error');
    }
}

export { getResults, getLabTests };