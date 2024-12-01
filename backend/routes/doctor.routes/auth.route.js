import express from 'express';

import { changePassword } from '../../controllers/doctor.controllers/auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.put('/change-password', protect('doctor'), changePassword);

export default router;


