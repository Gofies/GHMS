import express from 'express';

import { protect } from '../../middlewares/auth.middleware.js';
import { getLabTests, deleteLabTest } from '../../controllers/lab.controllers/test.controller.js';

const router = express.Router();

router.get('/', protect('labtechnician'), getLabTests);
router.delete('/labTests/:labTestId', deleteLabTest);

export default router;