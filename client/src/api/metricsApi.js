import api from './axiosInstance.js';

const getDataEntries = (response) => response?.data?.data ?? response?.data ?? [];

const toDisplayStatus = (status) => {
  if (!status) return 'PENDING';
  const normalized = String(status).toUpperCase();
  if (normalized === 'PENDING') return 'PENDING_APPROVAL';
  return normalized;
};

const buildTrendFromTransactions = (transactions = []) => {
  const sortedTransactions = [...transactions].sort((first, second) => new Date(first.createdAt || first.date || 0) - new Date(second.createdAt || second.date || 0));
  return sortedTransactions.map((transaction) => ({
    month: new Date(transaction.createdAt || transaction.date || Date.now()).toLocaleString('en', { month: 'short' }),
    emissions: Number(transaction.calculatedEmission || transaction.emission || 0),
  }));
};

const normalizeScorePayload = (score) => ({
  environmentalScore: Number(score?.environmental ?? score?.environmentalScore ?? 0),
  socialScore: Number(score?.social ?? score?.socialScore ?? 0),
  governanceScore: Number(score?.governance ?? score?.governanceScore ?? 0),
  overallScore: Number(score?.totalScore ?? score?.overallScore ?? 0),
});

export const fetchDepartments = async () => {
  const response = await api.get('/departments');
  return { data: { success: true, data: getDataEntries(response) } };
};

export const fetchEmissionFactors = async () => {
  const response = await api.get('/emission-factors');
  return { data: { success: true, data: getDataEntries(response) } };
};

export const fetchCarbonTransactions = async () => {
  const response = await api.get('/carbon');
  return { data: { success: true, data: getDataEntries(response).map((transaction) => ({
    ...transaction,
    departmentId: transaction.department?.id ?? transaction.departmentId,
    department: transaction.department || { id: transaction.departmentId, name: `Department ${transaction.departmentId}` },
    emissionFactor: transaction.emissionFactor || { name: 'Unknown', unit: 'kg CO2e', factor: 1 },
    quantity: Number(transaction.quantity || 0),
    calculatedEmission: Number(transaction.calculatedEmission || 0),
  })) } };
};

export const fetchCarbonSummary = async (departmentId) => {
  const [summaryResponse, transactionsResponse] = await Promise.all([
    api.get(`/carbon/summary/${departmentId || 1}`),
    api.get('/carbon'),
  ]);
  const summary = summaryResponse?.data?.data || {};
  const transactions = getDataEntries(transactionsResponse)
    .filter((transaction) => !departmentId || Number(transaction.departmentId) === Number(departmentId));

  return {
    data: {
      success: true,
      data: {
        departmentId: Number(departmentId || summary.departmentId || 1),
        totalEmissions: Number(summary.totalEmission || summary.totalEmissions || 0),
        trend: buildTrendFromTransactions(transactions),
      },
    },
  };
};

export const createCarbonTransaction = async (payload) => api.post('/carbon', {
  departmentId: Number(payload.departmentId),
  emissionFactorId: Number(payload.emissionFactorId),
  quantity: Number(payload.quantity),
});

export const fetchCsrActivities = async () => {
  const response = await api.get('/participation');
  const participations = getDataEntries(response);
  return {
    data: {
      success: true,
      data: participations.map((participation) => ({
        id: participation.id,
        title: participation.csrActivity?.title || 'CSR activity',
        description: participation.csrActivity?.description || 'Community impact submission',
        status: toDisplayStatus(participation.status),
        participant: participation.user,
        hoursSpent: participation.csrActivity?.hoursSpent || 0,
        evidenceRequired: Boolean(participation.csrActivity?.evidenceRequired),
        pointsEarned: Number(participation.pointsEarned || 0),
      })),
    },
  };
};

export const submitCsrActivity = async (payload) => {
  const activityResponse = await api.post('/csr', {
    title: payload.title,
    description: payload.description,
    departmentId: payload.departmentId,
    hoursSpent: Number(payload.hoursSpent || 0),
    evidenceRequired: Boolean(payload.evidenceRequired),
  });
  const activity = activityResponse?.data?.data;

  return api.post('/participation', {
    csrActivityId: activity?.id,
    proofUrl: payload.evidenceUrl || null,
  });
};

export const approveCsrActivity = (id) => api.put(`/participation/${id}/approve`, { status: 'APPROVED' });
export const rejectCsrActivity = (id) => api.put(`/participation/${id}/approve`, { status: 'REJECTED' });

export const fetchComplianceItems = async () => {
  const response = await api.get('/compliance');
  const items = getDataEntries(response);
  return {
    data: {
      success: true,
      data: items.map((item) => ({
        ...item,
        owner: item.owner?.name || item.owner || '',
        isOverdue: Boolean(item.isOverdue),
      })),
    },
  };
};

export const createComplianceItem = (payload) => api.post('/compliance', payload);
export const updateComplianceItem = (payload) => api.put(`/compliance/${payload.id}`, payload);

export const fetchOverallScores = async () => {
  const response = await api.get('/scores/overall');
  const score = response?.data?.data || {};
  return { data: { success: true, data: normalizeScorePayload(score) } };
};

export const fetchEmissionsTrend = async () => {
  const response = await api.get('/carbon');
  const transactions = getDataEntries(response);
  return { data: { success: true, data: buildTrendFromTransactions(transactions) } };
};

export const fetchDepartmentRankings = async () => {
  const departmentsResponse = await api.get('/departments');
  const departments = getDataEntries(departmentsResponse);

  const rankings = await Promise.all(
    departments.map(async (department) => {
      const scoreResponse = await api.get(`/scores/department/${department.id}`);
      const scoreData = scoreResponse?.data?.data || {};
      return {
        name: department.name,
        score: Number(scoreData.totalScore ?? scoreData.overallScore ?? 0),
      };
    }),
  );

  return { data: { success: true, data: rankings } };
};

export const fetchActivityFeed = async () => {
  const [participationsResponse, complianceResponse] = await Promise.all([api.get('/participation'), api.get('/compliance')]);
  const participations = getDataEntries(participationsResponse);
  const complianceItems = getDataEntries(complianceResponse);

  return {
    data: {
      success: true,
      data: [
        ...participations.slice(0, 2).map((participation) => ({
          id: participation.id,
          title: participation.csrActivity?.title || 'CSR participation',
          category: 'Social',
          time: 'Recently updated',
        })),
        ...complianceItems.slice(0, 1).map((item) => ({ id: item.id, title: item.title, category: 'Governance', time: 'Due soon' })),
      ],
    },
  };
};

export const fetchChallenges = async () => {
  const response = await api.get('/challenges');
  return { data: { success: true, data: getDataEntries(response) } };
};

export const fetchChallengeParticipations = async () => {
  const response = await api.get('/challenge-participation');
  return { data: { success: true, data: getDataEntries(response) } };
};

export const joinChallenge = (challengeId) => api.post(`/challenge-participation/${challengeId}/join`);
export const submitChallengeProgress = (participationId, payload) => api.put(`/challenge-participation/${participationId}/submit`, payload);
export const reviewChallengeParticipation = (participationId, payload) => api.put(`/challenge-participation/${participationId}/approve`, payload);

export const fetchBadgeGallery = async () => {
  const response = await api.get('/badges');
  return { data: { success: true, data: getDataEntries(response) } };
};

export const fetchLeaderboard = async () => {
  const response = await api.get('/leaderboard');
  return { data: { success: true, data: getDataEntries(response) } };
};
