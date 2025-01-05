import express from 'express';

import { changePassword } from '../../controllers/admin.controllers/auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.put('/change-password', protect('admin'), changePassword);

export default router;


