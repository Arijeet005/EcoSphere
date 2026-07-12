import express from 'express';
import {
  createCsrActivity,
  deleteCsrActivity,
  getCsrActivities,
  getCsrActivityById,
  updateCsrActivity,
} from '../controllers/csrController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getCsrActivities);
router.get('/:id', protect, getCsrActivityById);
router.post('/', protect, createCsrActivity);
router.put('/:id', protect, authorizeRole('MANAGER'), updateCsrActivity);
router.delete('/:id', protect, authorizeRole('MANAGER'), deleteCsrActivity);

export default router;
