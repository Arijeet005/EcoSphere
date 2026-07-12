import express from 'express';
import { createMetric, deleteMetric, getMetrics, updateMetric } from '../controllers/metricsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { validateMetric, handleValidationErrors } from '../middleware/validators.js';

const router = express.Router();
const emissionFactors = [
  { id: 1, name: 'Electricity', unit: 'kg CO2e/kWh', factor: 0.42 },
  { id: 2, name: 'Fuel', unit: 'kg CO2e/L', factor: 2.31 },
  { id: 3, name: 'Air Travel', unit: 'kg CO2e/km', factor: 0.19 },
];

router.get('/emission-factors', protect, (_req, res) => {
  res.json({ success: true, data: emissionFactors });
});

router.get('/', protect, getMetrics);
router.post('/', protect, authorizeRole('MANAGER'), validateMetric, handleValidationErrors, createMetric);
router.put('/:id', protect, authorizeRole('MANAGER'), updateMetric);
router.delete('/:id', protect, authorizeRole('MANAGER'), deleteMetric);

export default router;
