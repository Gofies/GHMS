import Doctor from "../../models/doctor.model.js";
import Prescription from "../../models/prescription.model.js";
import Diagnosis from "../../models/diagnosis.model.js";

const getPatientDetails = async (req, res) => {
    try {
        const { patientId } = req.params; // Query parametresinden hasta ID'si alınıyor

        // Doktorun, verilen ID'ye sahip bir hastası olup olmadığını kontrol ediyoruz
        const doctor = await Doctor.findById(req.user._id).populate({
            path: 'appointments',
            match: { patient: patientId }, // Belirli hastayı filtreliyoruz
            populate: {
                path: 'patient',
                select: 'name surname gender birthdate height weight bloodType', // Hasta bilgilerini seçiyoruz
            },
        });

        // Eğer doktor bulunamazsa veya hasta doktorun listesinde değilse hata döndür
        if (!doctor || !doctor.appointments.length) {
            return res.status(404).json({ message: 'Patient not found for this doctor' });
        }

        // Hastanın detaylarını alıyoruz
        const patientDetails = doctor.appointments[0].patient;

        return res.status(200).json({
            message: 'Patient details retrieved successfully',
            patient: patientDetails,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving patient details: ' + error.message });
    }
};


const getPatients = async (req, res) => {
    try {
        const patients = await Doctor.findById(req.user._id).select('appointments').populate({
            path: 'appointments',
            select: 'patient date', // Fields to select in the `appointments`
            populate: {
                path: 'patient', // Specify the nested path for `patient`
                select: 'name surname gender birthdate', // Fields to select in the `patient`
            },
        });


        return res.status(200).json({ message: 'Patients retrieved successfully', patients: patients });
    } catch (error) {
        return res.status(500).json({ message: "doctor.getPatients: " + error.message });
    }
}

const getPatientTestResults = async (req, res) => {
    try {
        if (!req.params.patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        const labtests = await Doctor
            .findById(req.user._id)
            .populate('appointments', 'patient date')
            .populate('patient')
            .where('patient._id')
            .equals(req.params.patientId)
            .populate('labtests');

        return res.status(200).json({ message: 'Patient retrieved successfully', labtests: labtests });
    } catch (error) {
        return res.status(500).json({ message: "doctor.getPatient: " + error.message });
    }
}

const getPatientAppointmentHistory = async (req, res) => {
    try {
        if (!req.params.patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        const appointments = await Doctor.findById(req.user._id).select('appointments')
            .populate({
                path: 'appointments', // Populate the 'appointments' field of the Doctor
                select: 'patient date treatment', // Select specific fields from 'appointments'
                populate: {
                    path: 'treatment'
                },
                populate: {
                    path: 'patient', // Populate the 'patient' field within each appointment
                    match: { _id: req.params.patientId }, // Filter appointments by patient ID
                    select: 'name surname'
                },
            });

        return res.status(200).json({ message: 'Appointments retrieved successfully', appointments: appointments.appointments });
    } catch (error) {
        return res.status(500).json({ message: "doctor.getPatient: " + error.message });
    }
}

const getPatientDiagnosisHistory = async (req, res) => {
    try {
        if (!req.params.patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        const diagnoses = await Doctor.findById(req.user._id).select('appointments')
            .populate({
                path: 'appointments', // Populate the 'patient' field of the Doctor
                select: 'patient', // Select specific fields from 'appointments'
                populate: ({
                    path: 'patient',
                    match: { _id: req.params.patientId }, // Filter for the specific patient
                    select: 'name surname diagnoses', // Select specific fields from the patient
                    populate: {
                        path: 'diagnoses', // Populate the 'diagnoses' field of the patient
                    }
                })
            });

        return res.status(200).json({ message: 'Diagnoses retrieved successfully', diagnoses: diagnoses.appointments[0].patient.diagnoses });
    } catch (error) {
        return res.status(500).json({ message: "doctor.getPatient: " + error.message });
    }
}

const getPatientFamilyHistory = async (req, res) => {
    try {
        if (!req.params.patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        const family = await Doctor.findById(req.user._id).select('appointments')
            .populate({
                path: 'appointments',
                select: 'patient', // Select specific fields from 'appointments'
                populate: ({
                    path: 'patient', // Populate the 'patient' field of the Doctor
                    match: { _id: req.params.patientId }, // Filter for the specific patient
                    select: 'name surname family', // Select specific fields from 'patient'
                    populate: {
                        path: 'family', // Populate the 'family' field of the patient
                        select: 'name surname diagnoses', // Select specific fields from 'family'
                        populate: {
                            path: 'diagnoses', // Populate the 'diagnoses' field of family members
                        }
                    }
                })
            });

        return res.status(200).json({ message: 'Family retrieved successfully', family: family.appointments[0].patient.family });
    } catch (error) {
        return res.status(500).json({ message: "doctor.getPatient: " + error.message });
    }
}

const getPatientPrescriptions = async (req, res) => {
    try {
        if (!req.params.patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        const prescriptions = await Doctor.findById(req.user._id).select('appointments')
            .populate({
                path: 'appointments',
                select: 'patient', // Select specific fields from 'appointments'
                populate: ({
                    path: 'patient', // Populate the 'patient' field of the Doctor
                    match: { _id: req.params.patientId }, // Filter for the specific patient
                    select: 'name surname prescriptions', // Select specific fields from 'patient'
                    populate: {
                        path: 'prescriptions', // Populate the 'family' field of the patient
                    }
                })
            });

        return res.status(200).json({ message: 'Prescriptions retrieved successfully', prescriptions: prescriptions.appointments[0].patient.prescriptions });
    }
    catch (error) {
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
    getPatientDetails,
    getPatients,
    getPatientTestResults,
    getPatientAppointmentHistory,
    getPatientDiagnosisHistory,
    getPatientFamilyHistory,
    getPatientPrescriptions,
    createPrescription,
    updatePrescription,
    deletePrescription
};
