import { calculateDepartmentScore, calculateOverallScore } from './services/scoringService.js';

const departmentScore = calculateDepartmentScore({ environmental: 82, social: 76, governance: 90 });
console.log('Department score:', departmentScore);

const overallScore = calculateOverallScore([departmentScore.totalScore, 74, 88]);
console.log('Overall score:', overallScore);
