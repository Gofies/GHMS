import express from 'express';
import { getDiagnoses, getLabTests, getOtherTests } from '../../controllers/patient.controllers/medical.record.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/lab-tests', protect('patient'), getLabTests);
router.get('/other-tests', protect('patient'), getOtherTests);
router.get('/diagnoses', protect('patient'), getDiagnoses);

export default router;