/**
 * Transform raw department operational records into the sub-score inputs expected by
 * calculateDepartmentScore(). The normalization approach is intentionally simple and
 * deterministic so the scoring remains audit-friendly for compliance-adjacent use cases.
 *
 * @param {{carbonTransactions?: Array<{calculatedEmission?: number}>, participationRecords?: Array<{status?: string}>, complianceIssues?: Array<{isResolved?: boolean}>}} rawDepartmentData
 * @returns {{environmental: number, social: number, governance: number}}
 */
export const aggregateDepartmentScore = (rawDepartmentData = {}) => {
  const safeData = rawDepartmentData || {};
  const carbonTransactions = Array.isArray(safeData.carbonTransactions) ? safeData.carbonTransactions : [];
  const participationRecords = Array.isArray(safeData.participationRecords) ? safeData.participationRecords : [];
  const complianceIssues = Array.isArray(safeData.complianceIssues) ? safeData.complianceIssues : [];

  const totalCarbonEmission = carbonTransactions.reduce((sum, transaction) => sum + (Number.isFinite(Number(transaction?.calculatedEmission)) ? Number(transaction.calculatedEmission) : 0), 0);
  const environmental = totalCarbonEmission > 0 ? Math.max(0, 100 - Math.min(100, totalCarbonEmission / 10)) : 100;

  const totalParticipations = participationRecords.length;
  const approvedParticipations = participationRecords.filter((record) => record?.status === 'APPROVED' || record?.status === 'COMPLETED').length;
  const social = totalParticipations > 0 ? (approvedParticipations / totalParticipations) * 100 : 100;

  const totalIssues = complianceIssues.length;
  const resolvedIssues = complianceIssues.filter((issue) => issue?.isResolved === true).length;
  const governance = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 100;

  return {
    environmental,
    social,
    governance,
  };
};
