import { calculateAndPersistDepartmentScore, getOverallScore } from '../services/scoringService.js';

export const getDepartmentScore = async (req, res, next) => {
  try {
    const score = await calculateAndPersistDepartmentScore(Number(req.params.departmentId));
    return res.json({ success: true, data: score });
  } catch (error) {
    return next(error);
  }
};

export const getOverallScoreSummary = async (_req, res, next) => {
  try {
    const score = await getOverallScore();
    return res.json({ success: true, data: score });
  } catch (error) {
    return next(error);
  }
};
