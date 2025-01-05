import express from 'express';
import { getPatients } from '../../controllers/admin.controllers/patient.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('admin'), getPatients);

export default router;