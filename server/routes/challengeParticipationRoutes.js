import express from 'express';
import {
  joinChallenge,
  listChallengeParticipations,
  reviewChallengeParticipation,
  submitChallengeProgress,
} from '../controllers/challengeParticipationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { handleValidationErrors } from '../middleware/validators.js';
import {
  validateChallengeReview,
  validateChallengeSubmission,
  validateJoinChallengeParam,
  validateParticipationIdParam,
} from '../validators/gamificationValidators.js';

const router = express.Router();

router.get('/', protect, listChallengeParticipations);
router.post(
  '/:challengeId/join',
  protect,
  authorizeRole('EMPLOYEE'),
  validateJoinChallengeParam,
  handleValidationErrors,
  joinChallenge,
);
router.put(
  '/:id/submit',
  protect,
  authorizeRole('EMPLOYEE'),
  validateParticipationIdParam,
  validateChallengeSubmission,
  handleValidationErrors,
  submitChallengeProgress,
);
router.put(
  '/:id/approve',
  protect,
  authorizeRole('MANAGER'),
  validateParticipationIdParam,
  validateChallengeReview,
  handleValidationErrors,
  reviewChallengeParticipation,
);

export default router;
