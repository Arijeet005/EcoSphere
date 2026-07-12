import { body, param, query } from 'express-validator';
import prisma from '../config/db.js';

const CHALLENGE_STATUSES = ['DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED'];
const REVIEW_STATUSES = ['APPROVED', 'REJECTED'];

const requireChallenge = async (value) => {
  const challenge = await prisma.challenge.findUnique({ where: { id: Number(value) } });
  if (!challenge) {
    throw new Error('Challenge not found.');
  }
  return true;
};

const requireParticipation = async (value) => {
  const participation = await prisma.challengeParticipation.findUnique({ where: { id: Number(value) } });
  if (!participation) {
    throw new Error('Challenge participation not found.');
  }
  return true;
};

export const validateChallengeIdParam = [
  param('id').isInt({ min: 1 }).withMessage('Challenge id must be a positive integer.').bail().custom(requireChallenge),
];

export const validateChallengeCreate = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').optional({ nullable: true }).trim(),
  body('departmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('departmentId must be valid.'),
  body('categoryId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('categoryId must be valid.'),
  body('startDate').isISO8601().withMessage('startDate must be a valid date.'),
  body('endDate')
    .isISO8601()
    .withMessage('endDate must be a valid date.')
    .bail()
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('endDate must be after startDate.');
      }
      return true;
    }),
  body('status').optional().isIn(CHALLENGE_STATUSES).withMessage('Invalid challenge status.'),
  body('evidenceRequired').optional().isBoolean().withMessage('evidenceRequired must be boolean.'),
  body('xpReward').optional().isInt({ min: 0 }).withMessage('xpReward must be a non-negative integer.'),
];

export const validateChallengeUpdate = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty.'),
  body('description').optional({ nullable: true }).trim(),
  body('departmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('departmentId must be valid.'),
  body('categoryId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('categoryId must be valid.'),
  body('startDate').optional().isISO8601().withMessage('startDate must be a valid date.'),
  body('endDate').optional().isISO8601().withMessage('endDate must be a valid date.'),
  body('evidenceRequired').optional().isBoolean().withMessage('evidenceRequired must be boolean.'),
  body('xpReward').optional().isInt({ min: 0 }).withMessage('xpReward must be a non-negative integer.'),
];

export const validateChallengeStatusUpdate = [
  body('status').isIn(CHALLENGE_STATUSES).withMessage('Invalid challenge status.'),
];

export const validateJoinChallengeParam = [
  param('challengeId')
    .isInt({ min: 1 })
    .withMessage('Challenge id must be a positive integer.')
    .bail()
    .custom(requireChallenge),
];

export const validateParticipationIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Participation id must be a positive integer.')
    .bail()
    .custom(requireParticipation),
];

export const validateChallengeSubmission = [
  body('progressValue').optional().isFloat({ min: 0 }).withMessage('progressValue must be a non-negative number.'),
  body('evidenceUrl').optional({ nullable: true }).trim(),
  body('submissionNote').optional({ nullable: true }).trim(),
];

export const validateChallengeReview = [
  body('status').optional().isIn(REVIEW_STATUSES).withMessage('Status must be APPROVED or REJECTED.'),
  body('approved').optional().isBoolean().withMessage('approved must be boolean.'),
  body('xpAwarded').optional().isInt({ min: 0 }).withMessage('xpAwarded must be a non-negative integer.'),
];

export const validateLeaderboardQuery = [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
  query('departmentId').optional().isInt({ min: 1 }).withMessage('departmentId must be a positive integer.'),
];
