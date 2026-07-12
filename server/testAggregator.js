import { aggregateDepartmentScore } from './services/scoreAggregator.js';

const sampleData = {
  carbonTransactions: [{ calculatedEmission: 150 }, { calculatedEmission: 80 }],
  participationRecords: [{ status: 'APPROVED' }, { status: 'PENDING' }],
  complianceIssues: [{ isResolved: true }, { isResolved: false }],
};

const aggregated = aggregateDepartmentScore(sampleData);
console.log('Aggregated sub-scores:', aggregated);
