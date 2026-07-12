import prisma from '../config/db.js';
import { aggregateDepartmentScore } from '../services/scoreAggregator.js';
import { calculateDepartmentScore, calculateOverallScore } from '../services/scoringService.js';

export const getDepartmentScore = async (req, res, next) => {
  try {
    const departmentId = Number(req.params.id);
    const [department, carbonTransactions, csrActivities, complianceIssues] = await Promise.all([
      prisma.department.findUnique({ where: { id: departmentId } }),
      prisma.carbonTransaction.findMany({ where: { departmentId }, select: { calculatedEmission: true } }),
      prisma.csrActivity.findMany({ where: { departmentId }, select: { status: true } }),
      prisma.complianceIssue.findMany({ where: { departmentId }, select: { isResolved: true } }),
    ]);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    const subScores = aggregateDepartmentScore({
      carbonTransactions,
      participationRecords: csrActivities,
      complianceIssues,
    });

    const score = calculateDepartmentScore(subScores);

    return res.json({ success: true, data: { departmentId, departmentName: department.name, ...score } });
  } catch (error) {
    return next(error);
  }
};

export const getOverallScore = async (_req, res, next) => {
  try {
    const departments = await prisma.department.findMany({ select: { id: true } });
    const scorePromises = departments.map(async (department) => {
      const [carbonTransactions, csrActivities, complianceIssues] = await Promise.all([
        prisma.carbonTransaction.findMany({ where: { departmentId: department.id }, select: { calculatedEmission: true } }),
        prisma.csrActivity.findMany({ where: { departmentId: department.id }, select: { status: true } }),
        prisma.complianceIssue.findMany({ where: { departmentId: department.id }, select: { isResolved: true } }),
      ]);

      const subScores = aggregateDepartmentScore({
        carbonTransactions,
        participationRecords: csrActivities,
        complianceIssues,
      });

      return calculateDepartmentScore(subScores).totalScore;
    });

    const departmentScores = await Promise.all(scorePromises);
    const overallScore = calculateOverallScore(departmentScores);

    return res.json({ success: true, data: { overallScore, departmentCount: departments.length } });
  } catch (error) {
    return next(error);
  }
};
