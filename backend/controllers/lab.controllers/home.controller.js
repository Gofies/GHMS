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
        const { testId, result } = req.body; // testId ve result bilgilerini alın

        // Testin mevcut olup olmadığını kontrol edin
        const labTest = await LabTest.findById(testId);
        if (!labTest) {
            return res.status(404).json({ message: 'Lab test not found' });
        }

        // Testi güncelle
        labTest.status = 'completed';
        labTest.result = result || labTest.result; // Eğer bir result gönderildiyse güncelle
        labTest.resultdate = new Date(); // Testin tamamlandığı zamanı kaydedin

        await labTest.save(); // Değişiklikleri kaydet

        // Güncel durumu yeniden al
        const updatedLabTest = await LabTest.findById(testId)
            .populate('patient', 'name surname') // Patient bilgilerini al
            .populate('doctor', 'name surname'); // Doctor bilgilerini al

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

