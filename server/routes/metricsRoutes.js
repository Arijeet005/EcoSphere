import express from 'express';
import { createMetric, deleteMetric, getMetrics, updateMetric } from '../controllers/metricsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { validateMetric, handleValidationErrors } from '../middleware/validators.js';

const router = express.Router();

router.get('/', protect, getMetrics);
router.post('/', protect, authorizeRole('MANAGER'), validateMetric, handleValidationErrors, createMetric);
router.put('/:id', protect, authorizeRole('MANAGER'), updateMetric);
router.delete('/:id', protect, authorizeRole('MANAGER'), deleteMetric);

export default router;
