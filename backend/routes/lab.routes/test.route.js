import express from 'express';

import { protect } from '../../middlewares/auth.middleware.js';
import { getLabTests, getResults, deleteLabTest } from '../../controllers/lab.controllers/test.controller.js';

const router = express.Router();

router.get('/', protect('labtechnician'), getLabTests);
router.get('/results', protect('labtechnician'), getResults);
router.delete('/labTests/:labTestId', deleteLabTest);


export default router;