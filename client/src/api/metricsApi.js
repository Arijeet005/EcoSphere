import {
  getMockActivityFeed,
  getMockCarbonSummary,
  getMockCarbonTransactions,
  getMockComplianceItems,
  getMockCsrActivities,
  getMockDepartmentRankings,
  getMockDepartments,
  getMockEmissionFactors,
  getMockEmissionsTrend,
  getMockOverallScores,
  mockApproveCsrActivity,
  mockCreateCarbonTransaction,
  mockCreateComplianceIssue,
  mockRejectCsrActivity,
  mockSubmitCsrActivity,
  mockUpdateComplianceIssue,
} from './mockApi.js';

export const fetchDepartments = () => getMockDepartments();
export const fetchEmissionFactors = () => getMockEmissionFactors();
export const fetchCarbonTransactions = () => getMockCarbonTransactions();
export const fetchCarbonSummary = (departmentId) => getMockCarbonSummary(departmentId);
export const createCarbonTransaction = (payload) => mockCreateCarbonTransaction(payload);
export const fetchCsrActivities = () => getMockCsrActivities();
export const submitCsrActivity = (payload) => mockSubmitCsrActivity(payload);
export const approveCsrActivity = (id) => mockApproveCsrActivity(id);
export const rejectCsrActivity = (id) => mockRejectCsrActivity(id);
export const fetchComplianceItems = () => getMockComplianceItems();
export const createComplianceItem = (payload) => mockCreateComplianceIssue(payload);
export const updateComplianceItem = (payload) => mockUpdateComplianceIssue(payload);
export const fetchOverallScores = () => getMockOverallScores();
export const fetchEmissionsTrend = () => getMockEmissionsTrend();
export const fetchDepartmentRankings = () => getMockDepartmentRankings();
export const fetchActivityFeed = () => getMockActivityFeed();
