import express from 'express';

import { newPolyclinic, updatePolyclinic, deletePolyclinic, getPolyclinics } from '../../controllers/admin.controllers/polyclinic.controller.js';

import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:id', protect('admin'), getPolyclinics);
router.post('/', protect('admin'), newPolyclinic);
router.put('/:id', protect('admin'), updatePolyclinic);
router.delete('/:id', protect('admin'), deletePolyclinic);

export default router;