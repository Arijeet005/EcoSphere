import express from 'express';
<<<<<<< HEAD
import { getDepartmentScore, getOverallScore } from '../controllers/scoringController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/department/:id', protect, getDepartmentScore);
router.get('/overall', protect, getOverallScore);
=======
import { getDepartmentScore, getOverallScoreSummary } from '../controllers/scoreController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validators.js';
import { validateScoreDepartmentParam } from '../validators/scoreValidators.js';

const router = express.Router();

router.get('/department/:departmentId', protect, validateScoreDepartmentParam, handleValidationErrors, getDepartmentScore);
router.get('/overall', protect, getOverallScoreSummary);
>>>>>>> 6fd5ae2aec17d356888503d114494300fa69f4e4

export default router;
