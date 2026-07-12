import express from 'express';
import {
  createChallenge,
  deleteChallenge,
  getChallengeById,
  getChallenges,
  updateChallenge,
  updateChallengeStatus,
} from '../controllers/challengeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { handleValidationErrors } from '../middleware/validators.js';
import {
  validateChallengeCreate,
  validateChallengeIdParam,
  validateChallengeStatusUpdate,
  validateChallengeUpdate,
} from '../validators/gamificationValidators.js';

const router = express.Router();

router.get('/', protect, getChallenges);
router.get('/:id', protect, validateChallengeIdParam, handleValidationErrors, getChallengeById);
router.post('/', protect, authorizeRole('MANAGER'), validateChallengeCreate, handleValidationErrors, createChallenge);
router.put(
  '/:id',
  protect,
  authorizeRole('MANAGER'),
  validateChallengeIdParam,
  validateChallengeUpdate,
  handleValidationErrors,
  updateChallenge,
);
router.put(
  '/:id/status',
  protect,
  authorizeRole('MANAGER'),
  validateChallengeIdParam,
  validateChallengeStatusUpdate,
  handleValidationErrors,
  updateChallengeStatus,
);
router.delete('/:id', protect, authorizeRole('MANAGER'), validateChallengeIdParam, handleValidationErrors, deleteChallenge);

export default router;
