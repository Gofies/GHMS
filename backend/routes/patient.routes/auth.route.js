import express from 'express';

import { signup, login, logout, refreshToken } from '../../controllers/patient.controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);


export default router;