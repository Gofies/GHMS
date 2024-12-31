import express from 'express';

import {
    getPatientDetails,
    getPatients,
    createPrescription,
    updatePrescription,
    deletePrescription,
    getPatient,
    getLabTechniciansBySpecialization,
    newLabTestRequest
} from '../../controllers/doctor.controllers/patient.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('doctor'), getPatients);
router.get('/:patientId', protect('doctor'), getPatient);

router.post('/:patientId/prescriptions', protect('doctor'), createPrescription);
router.put('/:patientId/prescriptions/:prescriptionId', protect('doctor'), updatePrescription);
router.delete('/:patientId/prescriptions/:prescriptionId', protect('doctor'), deletePrescription);

router.post('/:patientId/labTests', protect('doctor'), newLabTestRequest);
router.get('/:patientId/labTests', protect('doctor'), getLabTechniciansBySpecialization);






export default router;