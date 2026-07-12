import express from 'express';
import {
  createCarbonTransaction,
  getDepartmentCarbonSummary,
  listCarbonTransactions,
} from '../controllers/carbonController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validators.js';
import {
  validateCarbonCreate,
  validateCarbonListQuery,
  validateDepartmentSummaryParam,
} from '../validators/environmentValidators.js';

const router = express.Router();

router.post('/', protect, validateCarbonCreate, handleValidationErrors, createCarbonTransaction);
router.get('/', protect, validateCarbonListQuery, handleValidationErrors, listCarbonTransactions);
router.get(
  '/summary/:departmentId',
  protect,
  validateDepartmentSummaryParam,
  handleValidationErrors,
  getDepartmentCarbonSummary,
);

export default router;
