import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { completeTest, getHomePage } from '../../controllers/lab.controllers/home.controller.js';

const router = express.Router();

router.get('/', protect('labtechnician'), getHomePage);
router.put('/', protect('labtechnician'), completeTest);

export default router;