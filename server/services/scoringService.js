import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const logger = require('node:console');

/**
 * Calculate a department ESG score using the default 40/30/30 weighting that matches the
 * business workflow described in the platform spec: environmental is the heaviest pillar
 * because carbon footprint reduction is the primary operational signal, while social and
 * governance remain significant but slightly less dominant for MVP scoring.
 *
 * @param {{environmental?: number, social?: number, governance?: number}} scoreInput
 * @param {{e?: number, s?: number, g?: number}} [weights]
 * @returns {{totalScore: number, environmental: number, social: number, governance: number}}
 */
export const calculateDepartmentScore = (scoreInput = {}, weights = { e: 0.4, s: 0.3, g: 0.3 }) => {
  const safeInput = scoreInput || {};
  const safeWeights = weights || { e: 0.4, s: 0.3, g: 0.3 };

  const environmental = Number.isFinite(Number(safeInput.environmental)) ? Number(safeInput.environmental) : 0;
  const social = Number.isFinite(Number(safeInput.social)) ? Number(safeInput.social) : 0;
  const governance = Number.isFinite(Number(safeInput.governance)) ? Number(safeInput.governance) : 0;

  if (!Number.isFinite(Number(safeWeights.e)) || !Number.isFinite(Number(safeWeights.s)) || !Number.isFinite(Number(safeWeights.g))) {
    throw new Error('Scoring weights must be numeric values.');
  }

  const totalWeight = Number(safeWeights.e) + Number(safeWeights.s) + Number(safeWeights.g);
  if (Math.abs(totalWeight - 1) > 1e-9) {
    throw new Error('Scoring weights must sum to 1.');
  }

  const totalScore = environmental * Number(safeWeights.e) + social * Number(safeWeights.s) + governance * Number(safeWeights.g);

  return {
    totalScore,
    environmental,
    social,
    governance,
  };
};

/**
 * Calculate an overall score by averaging department-level totals.
 * The MVP uses a simple average; this can later be refined to use employee counts or
 * department-specific weights if that becomes a business requirement.
 *
 * @param {number[]} departmentScores
 * @returns {number}
 */
export const calculateOverallScore = (departmentScores = []) => {
  if (!Array.isArray(departmentScores)) {
    throw new Error('departmentScores must be an array.');
  }

  if (departmentScores.length === 0) {
    logger.warn('No department scores provided; returning 0.');
    return 0;
  }

  const numericScores = departmentScores.map((score) => {
    if (!Number.isFinite(Number(score))) {
      throw new Error('Department scores must be numeric values.');
    }
    return Number(score);
  });

  return numericScores.reduce((sum, score) => sum + score, 0) / numericScores.length;
};
