import express from 'express';
import { getAppointments, newAppointment, cancelAppointment } from '../../controllers/patient.controllers/appointment.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('patient'), getAppointments);
router.post('/', protect('patient'), newAppointment);
router.delete('/', protect('patient'), cancelAppointment);

export default router;