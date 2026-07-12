import api from './axiosInstance.js';

const getDataEntries = (response) => response?.data?.data ?? response?.data ?? [];

const deriveFactor = (unit) => {
  const normalizedUnit = unit?.toLowerCase() || '';
  if (normalizedUnit.includes('kwh')) return 0.42;
  if (normalizedUnit.includes('litre') || normalizedUnit.includes('l')) return 2.31;
  if (normalizedUnit.includes('km')) return 0.19;
  return 1;
};

const buildTransactionFromMetric = (metric) => ({
  id: metric.id,
  departmentId: metric.departmentId,
  emissionFactorId: metric.id,
  quantity: Number(metric.value || 0),
  createdAt: metric.date || metric.createdAt,
  department: metric.department || { id: metric.departmentId, name: `Department ${metric.departmentId}` },
  emissionFactor: {
    id: metric.id,
    name: metric.name,
    unit: metric.unit,
    factor: deriveFactor(metric.unit),
  },
});

const buildTrendFromMetrics = (metrics) => {
  const sortedMetrics = [...metrics].sort((first, second) => new Date(first.date || 0) - new Date(second.date || 0));
  return sortedMetrics.map((metric) => ({
    month: new Date(metric.date || Date.now()).toLocaleString('en', { month: 'short' }),
    emissions: Number(metric.value || 0),
  }));
};

export const fetchDepartments = async () => {
  const response = await api.get('/departments');
  return { data: { success: true, data: getDataEntries(response) } };
};

export const fetchEmissionFactors = async () => {
  const response = await api.get('/metrics/emission-factors');
  return { data: { success: true, data: getDataEntries(response) } };
};

export const fetchCarbonTransactions = async () => {
  const response = await api.get('/metrics');
  const metrics = getDataEntries(response);
  return { data: { success: true, data: metrics.map(buildTransactionFromMetric) } };
};

export const fetchCarbonSummary = async (departmentId) => {
  const response = await api.get('/metrics');
  const metrics = getDataEntries(response);
  const matchingMetrics = departmentId ? metrics.filter((metric) => Number(metric.departmentId) === Number(departmentId)) : metrics;
  const totalEmissions = matchingMetrics.reduce((sum, metric) => sum + Number(metric.value || 0), 0);
  return {
    data: {
      success: true,
      data: {
        departmentId: Number(departmentId),
        totalEmissions,
        trend: buildTrendFromMetrics(matchingMetrics),
      },
    },
  };
};

export const createCarbonTransaction = async (payload) => {
  const metricPayload = {
    type: 'ENVIRONMENTAL',
    name: `Emission entry ${payload.departmentId}`,
    value: Number(payload.quantity),
    unit: 'kg CO2e',
    departmentId: Number(payload.departmentId),
  };
  return api.post('/metrics', metricPayload);
};

export const fetchCsrActivities = async () => {
  const response = await api.get('/csr');
  return { data: { success: true, data: getDataEntries(response) } };
};

export const submitCsrActivity = async (payload) => {
  const csrPayload = {
    title: payload.title,
    description: payload.description,
    participantId: 1,
    hoursSpent: Number(payload.hoursSpent || 0),
  };
  return api.post('/csr', csrPayload);
};

export const approveCsrActivity = (id) => api.patch(`/csr/${id}/approve`);
export const rejectCsrActivity = (id) => api.patch(`/csr/${id}/reject`);

export const fetchComplianceItems = async () => {
  const response = await api.get('/compliance');
  const items = getDataEntries(response);
  return {
    data: {
      success: true,
      data: items.map((item) => ({
        ...item,
        isOverdue: new Date(item.dueDate) < new Date() && item.status !== 'DONE',
      })),
    },
  };
};

export const createComplianceItem = (payload) => api.post('/compliance', payload);
export const updateComplianceItem = (payload) => api.put(`/compliance/${payload.id}`, payload);

export const fetchOverallScores = async () => {
  const response = await api.get('/metrics');
  const metrics = getDataEntries(response);
  const count = metrics.length || 1;
  return {
    data: {
      success: true,
      data: {
        environmentalScore: Math.min(100, 70 + count * 2),
        socialScore: Math.min(100, 74 + count),
        governanceScore: Math.min(100, 78 + count),
        overallScore: Math.min(100, 75 + count * 2),
      },
    },
  };
};

export const fetchEmissionsTrend = async () => {
  const response = await api.get('/metrics');
  const metrics = getDataEntries(response);
  return {
    data: {
      success: true,
      data: buildTrendFromMetrics(metrics),
    },
  };
};

export const fetchDepartmentRankings = async () => {
  const [departmentsResponse, metricsResponse] = await Promise.all([api.get('/departments'), api.get('/metrics')]);
  const departments = getDataEntries(departmentsResponse);
  const metrics = getDataEntries(metricsResponse);
  return {
    data: {
      success: true,
      data: departments.map((department, index) => ({
        name: department.name,
        score: Math.min(100, 80 + index + (metrics.length > 0 ? 2 : 0)),
      })),
    },
  };
};

export const fetchActivityFeed = async () => {
  const [csrResponse, complianceResponse] = await Promise.all([api.get('/csr'), api.get('/compliance')]);
  const activities = getDataEntries(csrResponse);
  const complianceItems = getDataEntries(complianceResponse);
  return {
    data: {
      success: true,
      data: [
        ...activities.slice(0, 2).map((activity) => ({ id: activity.id, title: activity.title, category: 'Social', time: 'Recently updated' })),
        ...complianceItems.slice(0, 1).map((item) => ({ id: item.id, title: item.title, category: 'Governance', time: 'Due soon' })),
      ],
    },
  };
};

export const fetchChallenges = async () => {
  const response = await api.get('/metrics');
  return { data: { success: true, data: [] } };
};

export const fetchChallengeParticipations = async () => {
  const response = await api.get('/metrics');
  return { data: { success: true, data: [] } };
};

export const fetchBadgeGallery = async () => {
  const response = await api.get('/metrics');
  return { data: { success: true, data: [] } };
};

export const fetchLeaderboard = async () => {
  const response = await api.get('/metrics');
  return { data: { success: true, data: [] } };
};
