import express from 'express';
import { getDepartmentScore, getOverallScore } from '../controllers/scoringController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/department/:id', protect, getDepartmentScore);
router.get('/overall', protect, getOverallScore);

export default router;
