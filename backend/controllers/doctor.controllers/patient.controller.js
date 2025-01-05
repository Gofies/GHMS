import Doctor from "../../models/doctor.model.js";
import Prescription from "../../models/prescription.model.js";
import Diagnosis from "../../models/diagnosis.model.js";

import Patient from "../../models/patient.model.js";
import Hospital from "../../models/hospital.model.js";

import LabTest from "../../models/lab.test.model.js";
import LabTechnician from "../../models/lab.technician.model.js";

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
                options: { sort: { date: -1 } }, // Tarihe göre azalan sırada sıralama
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

        // Fetch the doctor's hospital ID
        const doctor = await Doctor.findById(doctorId).populate('hospital', '_id');
        if (!doctor || !doctor.hospital) {
            return res.status(404).json({ message: 'Doctor or hospital not found.' });
        }

        const doctorHospitalId = doctor.hospital._id.toString();

        // Fetch the patient data
        const patient = await Patient.findById(patientId)
            .select('-password -email -address -nationality -emergencycontact -phone -role -createdAt -updatedAt')
            .populate({
                path: 'labtests',
                match: { hospital: doctorHospitalId },
                options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: 'labTechnician',
                        select: 'name surname'
                    },
                    {
                        path: 'hospital',
                        select: 'name'
                    },
                    {
                        path: 'doctor',
                        select: 'name surname'
                    }
                ]
            })
            .populate({
                path: 'prescriptions',
                options: { sort: { createdAt: -1 } },
                match: { hospital: doctorHospitalId }, // Filter prescriptions by hospital
                populate: [
                    {
                        path: 'doctor',
                        match: { hospital: doctorHospitalId }, // Filter by same hospital doctors
                        select: 'name surname hospital',
                        populate: {
                            path: 'hospital',
                            select: 'name'
                        }
                    }
                ]
            })
            .populate({
                path: 'appointments',
                match: { hospital: doctorHospitalId },
                options: { sort: { date: -1 } },
                populate: [
                    {
                        path: 'hospital',
                        select: 'name'
                    },
                    {
                        path: 'doctor',
                        select: 'name surname'
                    },
                    {
                        path: 'polyclinic',
                        select: 'name'
                    }
                ]
            });

        return res.status(200).json({ message: 'Patient retrieved successfully', patient });
    } catch (error) {
        console.error('Error in getPatient:', error);
        return res.status(500).json({ message: "doctor.getPatient: " + error.message });
    }
};





const createPrescription = async (req, res) => {
    try {
        const doctorId = req.user._id; // Giriş yapan doktorun ID'si
        const patientId = req.params.patientId; // Hedef hastanın ID'si

        if (!patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        const { medicine, status } = req.body;

        // Doktorun ilgili hastası olup olmadığını kontrol et
        const doctor = await Doctor.findById(doctorId)
            .populate({
                path: 'appointments',
                match: { patient: patientId }, // Sadece bu hastanın randevularını kontrol et
                select: 'patient hospital', // Sadece hasta ve hastane bilgilerini çek
                populate: {
                    path: 'hospital',
                    select: '_id name' // Sadece hastane ID ve adı
                }
            });

        if (!doctor || doctor.appointments.length === 0) {
            return res.status(403).json({ message: 'You are not authorized to create a prescription for this patient.' });
        }

        // Hastane bilgisini al
        const hospital = doctor.hospital;
        if (!hospital) {
            return res.status(400).json({ message: 'Hospital information is missing for the doctor.' });
        }

        // Yeni reçete oluştur
        const prescription = new Prescription({
            medicine,
            status,
            doctor: doctorId, // Reçeteyi yazan doktor
            hospital: hospital._id // Hastane bilgisi
        });

        await prescription.save();

        // Hastaya reçeteyi ekle
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.prescriptions.push(prescription._id);
        await patient.save();

        return res.status(201).json({ message: 'Prescription created successfully', prescription });
    } catch (error) {
        console.error('Error in createPrescription:', error);
        return res.status(500).json({ message: "doctor.createPrescription: " + error.message });
    }
};


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

const getLabTechniciansBySpecialization = async (req, res) => {
    try {
        const { specialization } = req.query; // Query parametresinden specialization bilgisi alınır
        const doctorId = req.user._id;

        // Doktor bilgilerini al ve hastane ID'sini öğren
        const doctor = await Doctor.findById(doctorId).populate('hospital', '_id');
        if (!doctor || !doctor.hospital) {
            return res.status(404).json({ message: 'Doctor or hospital not found' });
        }

        const hospitalId = doctor.hospital._id;

        // Belirtilen uzmanlık alanına ve hastaneye sahip teknisyenleri al
        const labTechnicians = await LabTechnician.find({
            hospital: hospitalId,
            specialization: specialization,
        }).select('name surname specialization');

        // Eğer teknisyen bulunamazsa hata döndür
        if (!labTechnicians.length) {
            return res.status(404).json({ message: 'No lab technicians found for the specified specialization' });
        }

        // Teknisyen listesini döndür
        return res.status(200).json({
            message: 'Lab technicians retrieved successfully',
            labTechnicians,
        });
    } catch (error) {
        console.error(error, 'Error in getLabTechniciansBySpecialization');
        return res.status(500).json({ message: 'Server Error' });
    }
};


const newLabTestRequest = async (req, res) => {
    try {
        console.log("a",req.body);
        const { patientId, labTechnicianId, testType, urgency, specialization } = req.body;
        const doctorId = req.user._id;

        // Gerekli alanların kontrolü
        if (!patientId || !labTechnicianId || !testType || !urgency || !specialization) {
            return res.status(400).json({ message: 'All fields are required (patientId, labTechnicianId, testType, urgency, specialization)' });
        }

        // Doctor'dan hospital ve polyclinic bilgilerini al
        const doctor = await Doctor.findById(doctorId)
            .populate('hospital', '_id')
            .populate('polyclinic', '_id');

        if (!doctor || !doctor.hospital || !doctor.polyclinic) {
            return res.status(404).json({ message: 'Doctor, hospital, or polyclinic not found' });
        }

        const hospitalId = doctor.hospital._id;
        const polyclinicId = doctor.polyclinic._id;

        // Seçilen lab technician'ı kontrol et
        const labTechnician = await LabTechnician.findById(labTechnicianId);
        if (!labTechnician) {
            return res.status(404).json({ message: 'Lab technician not found' });
        }

        // Lab technician'ın doktorun hastanesiyle uyumlu olup olmadığını kontrol et
        if (labTechnician.hospital.toString() !== hospitalId.toString()) {
            return res.status(400).json({ message: 'Lab technician does not belong to the same hospital as the doctor' });
        }

        // Lab technician'ın uzmanlık alanını kontrol et
        if (labTechnician.specialization !== specialization) {
            return res.status(400).json({ message: 'Lab technician specialization does not match the requested specialization' });
        }

        // Yeni lab testi oluştur
        const labTest = new LabTest({
            patient: patientId,
            doctor: doctorId,
            hospital: hospitalId,
            polyclinic: polyclinicId,
            labTechnician: labTechnicianId,
            testType,
            urgency,
            specialization,
            status: 'pending',
        });

        await labTest.save();

        // Hospital'da labTests array'ine ekleme yap
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        hospital.labTests.push(labTest._id); // Array'e ekleme yap
        await hospital.save(); // Kaydet

        // Patient'da labtests array'ine ekleme yap
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.labtests.push(labTest._id); // Yeni labTest ID'sini ekle
        await patient.save(); // Değişiklikleri kaydet

          // Doctor'da labtests array'ine ekleme yap
          doctor.labtests.push(labTest._id); // Yeni labTest ID'sini ekle
          await doctor.save(); // Değişiklikleri kaydet

        // Başarılı yanıt dön
        res.status(201).json({
            message: 'Lab test created successfully',
            labTest,
        });
    } catch (error) {
        console.error('Error in newLabTestRequest:', error);
        res.status(500).json({ message: 'Server error occurred' });
    }
};

export {
    getPatientDetails,
    getPatients,
    getPatient,
    createPrescription,
    updatePrescription,
    deletePrescription,
    getLabTechniciansBySpecialization,
    newLabTestRequest
};
