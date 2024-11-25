import express from 'express';
import { getProfile, updateProfile } from '../../controllers/patient.controllers/profile.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('patient'), getProfile);
router.put('/', protect('patient'), updateProfile);

export default router;