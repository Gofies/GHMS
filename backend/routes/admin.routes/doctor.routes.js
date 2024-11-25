import express from 'express';
import { getDoctors, getDoctor, newDoctor, updateDoctor, deleteDoctor } from '../../controllers/admin.controllers/doctor.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('admin'), getDoctors);
router.get('/:id', protect('admin'), getDoctor);
router.post('/', protect('admin'), newDoctor);
router.put('/:id', protect('admin'), updateDoctor);
router.delete('/:id', protect('admin'), deleteDoctor);

export default router;