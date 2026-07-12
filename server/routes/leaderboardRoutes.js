import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validators.js';
import { validateLeaderboardQuery } from '../validators/gamificationValidators.js';

const router = express.Router();

router.get('/', protect, validateLeaderboardQuery, handleValidationErrors, getLeaderboard);

export default router;
