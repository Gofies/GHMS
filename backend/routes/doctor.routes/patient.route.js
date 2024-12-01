import express from 'express';

import {
    getPatients,
    getPatientTestResults,
    getPatientAppointmentHistory,
    getPatientDiagnosisHistory,
    getPatientFamilyHistory,
    getPatientPrescriptions,
    createPrescription,
    updatePrescription,
    deletePrescription
} from '../../controllers/doctor.controllers/patient.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('doctor'), getPatients);
router.get('/:patientId/test-results', protect('doctor'), getPatientTestResults);
router.get('/:patientId/appointment-history', protect('doctor'), getPatientAppointmentHistory);
router.get('/:patientId/diagnosis-history', protect('doctor'), getPatientDiagnosisHistory);
router.get('/:patientId/family-history', protect('doctor'), getPatientFamilyHistory);
router.get('/:patientId/prescriptions', protect('doctor'), getPatientPrescriptions);
router.post('/:patientId/prescriptions', protect('doctor'), createPrescription);
router.put('/:patientId/prescriptions/:prescriptionId', protect('doctor'), updatePrescription);
router.delete('/:patientId/prescriptions/:prescriptionId', protect('doctor'), deletePrescription);



export default router;