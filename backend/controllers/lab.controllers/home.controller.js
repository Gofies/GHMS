import { populate } from 'dotenv';
import LabTechnician from '../../models/lab.technician.model.js';
import LabTest from '../../models/lab.test.model.js';

const getHomePage = async (req, res) => {
    try {
        const id = req.user._id;

        const labTestQueue = await LabTechnician.findById(id)
            .select('hospital')
            .populate({
                path: 'hospital',
                model: 'Hospital',
                select: 'labTests',
                populate: {
                    path: 'labTests',
                    model: 'LabTest',
                    match: { status: 'pending' },
                    select: 'patient testtype urgency doctor',
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
        const { testId, result } = req.body;

        const labTest = await LabTest.findById(testId);
        if (!labTest) {
            return res.status(404).json({ message: 'Lab test not found' });
        }

        labTest.status = 'completed';
        labTest.result = result || labTest.result;
        labTest.resultdate = new Date();

        await labTest.save();

        const updatedLabTest = await LabTest.findById(testId)
            .populate('patient', 'name surname')
            .populate('doctor', 'name surname');

        return res.status(200).json({
            message: 'Lab test completed successfully',
            completedTest: updatedLabTest
        });
    } catch (error) {
        console.error('Error in completeTest controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getHomePage, completeTest };

