import express from 'express';

import { getDoctorHome } from '../../controllers/doctor.controllers/home.controller.js';

import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('doctor'), getDoctorHome);

export default router;