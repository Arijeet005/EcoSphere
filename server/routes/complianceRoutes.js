import express from 'express';
import {
  createComplianceIssue,
  deleteComplianceIssue,
  getComplianceIssueById,
  getComplianceIssues,
  getOverdueComplianceIssues,
  updateComplianceIssue,
} from '../controllers/complianceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getComplianceIssues);
router.get('/overdue', protect, getOverdueComplianceIssues);
router.get('/:id', protect, getComplianceIssueById);
router.post('/', protect, authorizeRole('MANAGER'), createComplianceIssue);
router.put('/:id', protect, authorizeRole('MANAGER'), updateComplianceIssue);
router.delete('/:id', protect, authorizeRole('MANAGER'), deleteComplianceIssue);

export default router;
