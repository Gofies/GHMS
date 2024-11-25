import express from 'express';

import { login, logout, refreshToken, adminSignup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/admin-signup', adminSignup);


export default router;