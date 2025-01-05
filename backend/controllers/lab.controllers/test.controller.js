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

const deleteLabTest = async (req, res) => {
    try {
        const { labTestId } = req.params; // Silinecek lab testin ID'sini al

        // Lab testin var olup olmadığını kontrol et
        const labTest = await LabTest.findById(labTestId);
        if (!labTest) {
            return res.status(404).json({ message: 'Lab test not found' });
        }

        // Lab testi sil
        await labTest.deleteOne();

        res.status(200).json({ message: 'Lab test deleted successfully' });
    } catch (error) {
        console.error('Error in deleteLabTest controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getLabTests = async (req, res) => {
    try {
        // Giriş yapan lab technician'ın ID'sini al
        const labTechnicianId = req.user._id;

        // Lab Technician'ın kendisine atanmış testlerini al
        const labTechnician = await LabTechnician.findById(labTechnicianId)
            .select('hospital')
            .populate({
                path: 'hospital',
                select: 'labTests',
                populate: {
                    path: 'labTests',
                    model: 'LabTest',
                    match: { labTechnician: labTechnicianId }, // Sadece giriş yapan lab technician'a ait testleri filtrele
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

        // Pending testleri al ve createdAt'e göre desc sırala
        const pendingTests = labTechnician.hospital.labTests
            .filter(test => test.status === 'pending')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Descending sort by createdAt
            .map(test => ({
                _id: test._id,
                patient: test.patient,
                doctor: test.doctor,
                hospital: labTechnician.hospital._id,
                polyclinic: test.polyclinic,
                status: test.status,
                testType: test.testType, // Test tipi (doctor, lab, radiology)
                urgency: test.urgency, // Urgency (low, medium, high)
                createdAt: test.createdAt,
                updatedAt: test.updatedAt,
            }));

        // Completed testleri al ve createdAt'e göre desc sırala
        const completedTests = labTechnician.hospital.labTests
            .filter(test => test.status === 'completed')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Descending sort by createdAt
            .map(test => ({
                _id: test._id,
                patient: test.patient,
                doctor: test.doctor,
                hospital: labTechnician.hospital._id,
                polyclinic: test.polyclinic,
                status: test.status,
                testType: test.testType, // Test tipi (doctor, lab, radiology)
                urgency: test.urgency, // Urgency (low, medium, high)
                result: test.result, // Test sonucu
                resultDate: test.resultdate, // Testin tamamlandığı tarih
                createdAt: test.createdAt,
                updatedAt: test.updatedAt,
            }));

        // Response döndürülüyor
        res.json({ pendingTests, completedTests });
    } catch (error) {
        console.error('Error in getLabTests controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};




export { getResults, getLabTests, deleteLabTest };