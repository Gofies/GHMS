import express from 'express';

import { protect } from '../../middlewares/auth.middleware.js';
import { getLabTests, getResults } from '../../controllers/lab.controllers/test.controller.js';

const router = express.Router();

router.get('/', protect('labtechnician'), getLabTests);
router.get('/results', protect('labtechnician'), getResults);

export default router;