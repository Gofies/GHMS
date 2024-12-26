import express from 'express';

import { protect } from '../../middlewares/auth.middleware.js';

import { newLabTechnician, getLabTechnician, getAllLabTechnicians, updateLabTechnician, deleteLabTechnician } from '../../controllers/admin.controllers/labtechnician.controller.js';

const router = express.Router();

router.get('/', protect('admin'), getAllLabTechnicians);
router.get('/:id', protect('admin'), getLabTechnician);
router.post('/', protect('admin'), newLabTechnician);
router.put('/:id', protect('admin'), updateLabTechnician);
router.delete('/:id', protect('admin'), deleteLabTechnician);

export default router;