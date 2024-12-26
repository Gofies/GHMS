import express from 'express';
import { getHealthMetric, updateWeight, updateHeight, updateBloodPressure, updateBloodSugar, updateBloodType, updateHeartRate, updateAllergies, deleteAllergy } from '../../controllers/patient.controllers/health.metric.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', protect('patient'), getHealthMetric);
router.put('/weight', protect('patient'), updateWeight);
router.put('/height', protect('patient'), updateHeight);
router.put('/blood-pressure', protect('patient'), updateBloodPressure);
router.put('/blood-sugar', protect('patient'), updateBloodSugar);
router.put('/blood-type', protect('patient'), updateBloodType);
router.put('/heart-rate', protect('patient'), updateHeartRate);
router.put('/allergies', protect('patient'), updateAllergies);
router.delete('/allergies/', protect('patient'), deleteAllergy);


export default router;
