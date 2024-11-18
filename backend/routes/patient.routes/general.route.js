import express from 'express';

const router = express.Router();

router.get('/medical-records', getMedicalRecord);
router.get('/health-metrics', getHealthMetric);
