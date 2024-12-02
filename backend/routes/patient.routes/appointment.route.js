import express from 'express';
import { getAppointments, newAppointment, cancelAppointment, getHospitalByPolyclinic } from '../../controllers/patient.controllers/appointment.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('patient'), getHospitalByPolyclinic);
router.get('/', protect('patient'), getAppointments);
router.post('/', protect('patient'), newAppointment);
router.delete('/:id', protect('patient'), cancelAppointment);

export default router;