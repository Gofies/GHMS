import LabTechnician from "../../models/lab.technician.model.js";
import LabTest from "../../models/lab.test.model.js";

const getLabTests = async (req, res) => {
    try {
        const labTechnicianId = req.user._id;

        const labTechnician = await LabTechnician.findById(labTechnicianId)
            .select('hospital')
            .populate({
                path: 'hospital',
                select: 'labTests',
                populate: {
                    path: 'labTests',
                    model: 'LabTest',
                    match: { labTechnician: labTechnicianId },
                    populate: [
                        {
                            path: 'patient',
                            model: 'Patient',
                            select: 'name surname',
                        },
                        {
                            path: 'doctor',
                            model: 'Doctor',
                            select: 'name surname',
                        },
                    ],
                },
            });

        if (!labTechnician || !labTechnician.hospital || !labTechnician.hospital.labTests) {
            return res.status(404).json({ message: 'Lab tests not found' });
        }

        const pendingTests = labTechnician.hospital.labTests
            .filter(test => test.status === 'pending')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(test => ({
                _id: test._id,
                patient: test.patient,
                doctor: test.doctor,
                hospital: labTechnician.hospital._id,
                polyclinic: test.polyclinic,
                status: test.status,
                testType: test.testType, 
                urgency: test.urgency, 
                createdAt: test.createdAt,
                updatedAt: test.updatedAt,
            }));

        const completedTests = labTechnician.hospital.labTests
            .filter(test => test.status === 'completed')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
            .map(test => ({
                _id: test._id,
                patient: test.patient,
                doctor: test.doctor,
                hospital: labTechnician.hospital._id,
                polyclinic: test.polyclinic,
                status: test.status,
                testType: test.testType, 
                urgency: test.urgency, 
                result: test.result, 
                resultDate: test.resultdate, 
                createdAt: test.createdAt,
                updatedAt: test.updatedAt,
            }));

        res.json({ pendingTests, completedTests });
    } catch (error) {
        console.error('Error in getLabTests controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteLabTest = async (req, res) => {
    try {
        const { labTestId } = req.params;

        const labTest = await LabTest.findById(labTestId);
        if (!labTest) {
            return res.status(404).json({ message: 'Lab test not found' });
        }

        await labTest.deleteOne();

        res.status(200).json({ message: 'Lab test deleted successfully' });
    } catch (error) {
        console.error('Error in deleteLabTest controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getLabTests, deleteLabTest };