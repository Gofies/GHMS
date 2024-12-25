import express from 'express';

import { protect } from '../../middlewares/auth.middleware.js';
import { changePassword } from '../../controllers/lab.controllers/auth.controller.js';

const router = express.Router();

router.put('/', protect('labtechnician'), changePassword);


export default router;