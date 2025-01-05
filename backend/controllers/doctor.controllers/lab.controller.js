import LabTest from "../../models/lab.test.model";
import LabTechnician from "../../models/lab.technician.model";
import LabTestQueue from "../../models/lab.queue.model";
import Doctor from "../../models/doctor.model";
import Patient from "../../models/patient.model";
import Hospital from "../../models/hospital.model";

const newLabTestRequest = async (req, res) => {
    try {
        const { patientId } = req.body;
        const doctorId = req.user._id;

        const hospitalId = Doctor.findById(doctorId).select('hospital').populate('hospital', '_id');
        const polyclinicId = Doctor.findById(doctorId).select('polyclinic').populate('polyclinic', '_id');

        const labTest = new LabTest({
            patient: patientId,
            doctor: doctorId,
            hospital: hospitalId,
            polyclinic: polyclinicId,
            testType: 'lab',
            status: 'pending'
        });

        await labTest.save();

        const hospital = Hospital.findById(hospitalId).select('labTests').push(labTest._id);


        await hospital.save();

        res.json(labTest);
    } catch (error) {
        console.error(error, 'Error in newLabTest controller');
        res.status(500).send('Server Error');
    }
};