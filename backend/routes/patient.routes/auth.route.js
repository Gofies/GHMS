import express from 'express';

import { signup, changePassword } from '../../controllers/patient.controllers/auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.put('/change-password', protect('patient'), changePassword);

export default router;