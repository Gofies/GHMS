import express from 'express';
import { getPatientHome } from '../../controllers/patient.controllers/home.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('patient'), getPatientHome);

export default router;