import prisma from '../config/db.js';

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
  const aggregate = await prisma.departmentScore.aggregate({
    _avg: { totalScore: true },
    _count: { _all: true },
  });

  return {
    overallScore: clampScore(aggregate._avg.totalScore ?? 0),
    departmentScoreCount: aggregate._count._all,
  };
};
