import Doctor from "../../models/doctor.model.js";
import Prescription from "../../models/prescription.model.js";
import Diagnosis from "../../models/diagnosis.model.js";
import Patient from "../../models/patient.model.js";

const getPatients = async (req, res) => {
    try {
        // Get all appointments for the doctor
        const doctor = await Doctor.findById(req.user._id)
            .select('appointments')
            .populate({
                path: 'appointments',
                select: 'patient date',
                populate: {
                    path: 'patient',
                    select: 'name surname gender birthdate',
                },
            });

        // Filter unique patients by _id to avoid duplicates
        const patientsSet = new Set();
        const uniquePatients = doctor.appointments
            .map(appointment => appointment.patient)  // Extract patient details
            .filter(patient => {
                if (!patientsSet.has(patient._id.toString())) {
                    patientsSet.add(patient._id.toString());  // Add patient to the set
                    return true;  // Keep the patient
                }
                return false;  // Skip duplicates
            });

        return res.status(200).json({ message: 'Patients retrieved successfully', patients: uniquePatients });
    } catch (error) {
        return res.status(500).json({ message: "doctor.getPatients: " + error.message });
    }
};


const getPatient = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const patientId = req.params.patientId;

        const patient = await Patient
            .findById(patientId)
            .select('-password -email -address -nationality -emergencycontact -phone -role -createdAt -updatedAt ')
            .populate({
                path: 'appointments',
                select: 'date treatment',
                populate: {
                    path: 'treatment',
                },
                match: { doctor: doctorId }
            })
            .populate('labtests')
            .populate('prescriptions')
            .populate('diagnoses')
            .populate({
                path: 'family', // Populate the 'family' field of the patient
                select: 'name surname diagnoses', // Select specific fields from 'family'
                populate: {
                    path: 'diagnoses', // Populate the 'diagnoses' field of family members
                }
            })

        return res.status(200).json({ message: 'Patient retrieved successfully', patient: patient });


    } catch (error) {
        return res.status(500).json({ message: "doctor.getPatient: " + error.message });
    }
}

const createPrescription = async (req, res) => {
    try {
        if (!req.params.patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        const { medicine, status } = req.body;

        let patient = await Doctor.findById(req.user._id).select('appointments')
            .populate({
                path: 'appointments',
                select: 'patient', // Select specific fields from 'appointments'
                populate: ({
                    path: 'patient', // Populate the 'patient' field of the Doctor
                    match: { _id: req.params.patientId }, // Filter for the specific patient
                })
            });

        patient = patient.appointments[0].patient;

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const prescription = new Prescription({
            medicine,
            status,
        });

        await prescription.save();

        patient.prescriptions.push(prescription);
        await patient.save();

        return res.status(201).json({ message: 'Prescription created successfully', prescription: prescription });

    } catch (error) {
        return res.status(500).json({ message: "doctor.createPrescription: " + error.message });
    }
}

const updatePrescription = async (req, res) => {
    try {
        if (!req.params.prescriptionId) {
            return res.status(400).json({ message: 'Prescription ID is required' });
        }

        const { medicine, status } = req.body;

        const prescription = await Prescription.findById(req.params.prescriptionId);

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        prescription.medicine = medicine;
        prescription.status = status;

        await prescription.save();

        return res.status(200).json({ message: 'Prescription updated successfully', prescription: prescription });

    } catch (error) {
        return res.status(500).json({ message: "doctor.updatePrescription: " + error.message });
    }
}

const deletePrescription = async (req, res) => {
    try {
        if (!req.params.prescriptionId) {
            return res.status(400).json({ message: 'Prescription ID is required' });
        }

        await Prescription.findByIdAndDelete(req.params.prescriptionId);

        return res.status(200).json({ message: 'Prescription deleted successfully' });

    } catch (error) {
        return res.status(500).json({ message: "doctor.deletePrescription: " + error.message });
    }
}

export {
    getPatients,
    getPatient,
    createPrescription,
    updatePrescription,
    deletePrescription
};
