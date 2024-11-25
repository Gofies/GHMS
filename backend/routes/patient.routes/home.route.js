import express from 'express';
import { getRecentAppointments, getUpcomingAppointments } from '../../controllers/patient.controllers/home.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('patient'), getUpcomingAppointments, getRecentAppointments);

export default router;