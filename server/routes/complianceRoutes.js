import express from 'express';
import { createComplianceItem, deleteComplianceItem, getComplianceItems, updateComplianceItem } from '../controllers/complianceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getComplianceItems);
router.post('/', protect, authorizeRole('MANAGER'), createComplianceItem);
router.put('/:id', protect, authorizeRole('MANAGER'), updateComplianceItem);
router.delete('/:id', protect, authorizeRole('MANAGER'), deleteComplianceItem);

export default router;
