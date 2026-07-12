import prisma from '../config/db.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const logger = require('node:console');

const clampScore = (value) => Math.max(0, Math.min(100, Number(value.toFixed(2))));

const parseWeights = () => {
  const fallback = { environmental: 0.4, social: 0.3, governance: 0.3 };
  const rawWeights = process.env.DEFAULT_ESG_WEIGHTS;

  if (!rawWeights) {
    return fallback;
  }

  try {
    const parsed = rawWeights.trim().startsWith('{')
      ? JSON.parse(rawWeights)
      : rawWeights.split(/[/:,]/).map(Number);

    const weights = Array.isArray(parsed)
      ? {
          environmental: parsed[0],
          social: parsed[1],
          governance: parsed[2],
        }
      : {
          environmental: parsed.environmental ?? parsed.e ?? parsed.env,
          social: parsed.social ?? parsed.s,
          governance: parsed.governance ?? parsed.g,
        };

    const total = Number(weights.environmental) + Number(weights.social) + Number(weights.governance);

    if (!total || Number.isNaN(total)) {
      return fallback;
    }

    return {
      environmental: Number(weights.environmental) / total,
      social: Number(weights.social) / total,
      governance: Number(weights.governance) / total,
    };
  } catch (_error) {
    return fallback;
  }
};

const getEnvironmentalScore = async (departmentId) => {
  const aggregate = await prisma.carbonTransaction.aggregate({
    where: { departmentId },
    _sum: { calculatedEmission: true },
  });

  const totalEmission = aggregate._sum.calculatedEmission ?? 0;
  return clampScore(100 / (1 + totalEmission / 1000));
};

const getSocialScore = async (departmentId) => {
  const [employeeCount, approvedParticipations] = await Promise.all([
    prisma.user.count({ where: { departmentId, role: 'EMPLOYEE' } }),
    prisma.employeeParticipation.findMany({
      where: {
        status: 'APPROVED',
        csrActivity: { departmentId },
      },
      include: {
        csrActivity: { select: { hoursSpent: true } },
      },
    }),
  ]);

  if (!employeeCount) {
    return 0;
  }

  const participantCount = new Set(approvedParticipations.map((participation) => participation.userId)).size;
  const totalHours = approvedParticipations.reduce(
    (sum, participation) => sum + (participation.csrActivity?.hoursSpent ?? 0),
    0,
  );

  const participationRateScore = (participantCount / employeeCount) * 70;
  const volunteerHoursScore = Math.min(30, totalHours * 3);

  return clampScore(participationRateScore + volunteerHoursScore);
};

const getGovernanceScore = async (departmentId) => {
  const totalIssues = await prisma.complianceIssue.count({ where: { departmentId } });

  if (!totalIssues) {
    return 100;
  }

  const resolvedIssues = await prisma.complianceIssue.count({
    where: {
      departmentId,
      OR: [{ isResolved: true }, { status: 'CLOSED' }],
    },
  });

  return clampScore((resolvedIssues / totalIssues) * 100);
};

export const calculateAndPersistDepartmentScore = async (departmentId) => {
  const department = await prisma.department.findUnique({ where: { id: departmentId } });

  if (!department) {
    const error = new Error('Department not found.');
    error.statusCode = 404;
    throw error;
  }

  const [environmental, social, governance] = await Promise.all([
    getEnvironmentalScore(departmentId),
    getSocialScore(departmentId),
    getGovernanceScore(departmentId),
  ]);

  const weights = parseWeights();
  const totalScore = clampScore(
    environmental * weights.environmental + social * weights.social + governance * weights.governance,
  );

  return prisma.departmentScore.create({
    data: {
      departmentId,
      environmental,
      social,
      governance,
      totalScore,
    },
    include: {
      department: { select: { id: true, name: true } },
    },
  });
};

export const getOverallScore = async () => {
  const departments = await prisma.department.findMany({ select: { id: true } });
  if (departments.length === 0) {
    return {
      environmental: 0,
      social: 0,
      governance: 0,
      totalScore: 0,
      overallScore: 0,
      departmentCount: 0,
    };
  }

  const scores = await Promise.all(
    departments.map(async (d) => {
      try {
        return await calculateAndPersistDepartmentScore(d.id);
      } catch (err) {
        return { environmental: 0, social: 0, governance: 0, totalScore: 0 };
      }
    })
  );

  const avgEnvironmental = scores.reduce((sum, s) => sum + s.environmental, 0) / scores.length;
  const avgSocial = scores.reduce((sum, s) => sum + s.social, 0) / scores.length;
  const avgGovernance = scores.reduce((sum, s) => sum + s.governance, 0) / scores.length;
  const avgTotal = scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length;

  return {
    environmental: clampScore(avgEnvironmental),
    social: clampScore(avgSocial),
    governance: clampScore(avgGovernance),
    totalScore: clampScore(avgTotal),
    overallScore: clampScore(avgTotal),
    departmentCount: departments.length,
    departmentScoreCount: departments.length,
  };
};

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

