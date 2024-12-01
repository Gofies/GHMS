import express from 'express';

import { getHospitals, getHospital, newHospital, updateHospital, deleteHospital } from '../../controllers/admin.controllers/hospital.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect('admin'), getHospitals);
router.get('/:id', protect('admin'), getHospital);
router.post('/', protect('admin'), newHospital);
router.put('/:id', protect('admin'), updateHospital);
router.delete('/:id', protect('admin'), deleteHospital);

export default router;