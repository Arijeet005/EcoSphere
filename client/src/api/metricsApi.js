import { getMockCarbonSummary, getMockCarbonTransactions, getMockDepartments, getMockEmissionFactors, mockCreateCarbonTransaction } from './mockApi.js';

export const fetchDepartments = () => getMockDepartments();
export const fetchEmissionFactors = () => getMockEmissionFactors();
export const fetchCarbonTransactions = () => getMockCarbonTransactions();
export const fetchCarbonSummary = (departmentId) => getMockCarbonSummary(departmentId);
export const createCarbonTransaction = (payload) => mockCreateCarbonTransaction(payload);
