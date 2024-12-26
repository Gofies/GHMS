import { populate } from 'dotenv';
import LabTechnician from '../../models/lab.technician.model.js';
import LabTest from '../../models/lab.test.model.js';

const getHomePage = async (req, res) => {
    try {
        const id = req.user._id;

        const labTestQueue = await LabTechnician.findById(id)
            .select('hospital') // Select the hospital field from LabTechnician
            .populate({
                path: 'hospital',
                model: 'Hospital',
                select: 'labTests', // Select the labTests field from Hospital
                populate: {
                    path: 'labTests',
                    model: 'LabTest',
                    match: { status: 'pending' }, // Only include pending lab tests
                    select: 'patient testtype urgency doctor', // Select specific fields
                    populate: [
                        {
                            path: 'patient',
                            model: 'Patient',
                            select: 'name surname', // Select patient name and surname
                        },
                        {
                            path: 'doctor',
                            model: 'Doctor',
                            select: 'name surname', // Select doctor name and surname
                        },
                    ],
                },
            });


        if (!labTestQueue) {
            return res.status(404).json({ message: 'Lab test queue not found' });
        }

        res.json(labTestQueue);
    } catch (error) {
        console.error(error, 'Error in getHomePage controller');
        res.status(500).send('Server Error');
    }
};

const completeTest = async (req, res) => {
    try {
        const { testId } = req.body;

        await LabTest.findByIdAndUpdate(testId, { status: 'completed' });

        return res.status(200).json({ message: 'Lab test completed successfully' });
    }
    catch (error) {
        console.error(error, 'Error in completeTest controller');
        res.status(500).send('Server Error');
    }
}

export { getHomePage, completeTest };

