import express from 'express';
import { getDepartmentScore, getOverallScoreSummary } from '../controllers/scoreController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validators.js';
import { validateScoreDepartmentParam } from '../validators/scoreValidators.js';

const router = express.Router();

router.get('/department/:departmentId', protect, validateScoreDepartmentParam, handleValidationErrors, getDepartmentScore);
router.get('/overall', protect, getOverallScoreSummary);

export default router;
