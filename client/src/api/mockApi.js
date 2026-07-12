const departments = [
  { id: 1, name: 'Operations' },
  { id: 2, name: 'Supply Chain' },
];

const emissionFactors = [
  { id: 1, name: 'Electricity', unit: 'kg CO2e/kWh', factor: 0.42 },
  { id: 2, name: 'Fuel', unit: 'kg CO2e/L', factor: 2.31 },
  { id: 3, name: 'Air Travel', unit: 'kg CO2e/km', factor: 0.19 },
];

const carbonTransactions = [
  {
    id: 1,
    departmentId: 1,
    emissionFactorId: 1,
    quantity: 120,
    createdAt: '2026-07-10T00:00:00.000Z',
    department: departments[0],
    emissionFactor: emissionFactors[0],
  },
  {
    id: 2,
    departmentId: 2,
    emissionFactorId: 2,
    quantity: 45,
    createdAt: '2026-07-11T00:00:00.000Z',
    department: departments[1],
    emissionFactor: emissionFactors[1],
  },
  {
    id: 3,
    departmentId: 1,
    emissionFactorId: 3,
    quantity: 70,
    createdAt: '2026-07-12T00:00:00.000Z',
    department: departments[0],
    emissionFactor: emissionFactors[2],
  },
];

const complianceItems = [
  {
    id: 1,
    title: 'Carbon Disclosure Report',
    framework: 'CSRD',
    dueDate: '2026-07-20T00:00:00.000Z',
    status: 'PENDING',
    severity: 'HIGH',
    owner: 'Ava Manager',
    departmentId: 1,
    isOverdue: false,
    description: 'Prepare the quarterly carbon disclosure packet for regulators.',
  },
  {
    id: 2,
    title: 'Diversity Training Review',
    framework: 'UNGC',
    dueDate: '2026-07-18T00:00:00.000Z',
    status: 'DONE',
    severity: 'MEDIUM',
    owner: 'Leo Employee',
    departmentId: 1,
    isOverdue: true,
    description: 'Revise the training module and confirm completion logs.',
  },
];

const csrActivities = [
  {
    id: 1,
    title: 'Community Cleanup Drive',
    description: 'Volunteered with local partners to clean a riverbank.',
    participantId: 2,
    participant: { id: 2, name: 'Leo Employee' },
    date: '2026-07-08T00:00:00.000Z',
    hoursSpent: 4,
    evidenceRequired: true,
    evidenceUrl: '',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 2,
    title: 'Mentorship Session',
    description: 'Guided interns through sustainability reporting basics.',
    participantId: 1,
    participant: { id: 1, name: 'Ava Manager' },
    date: '2026-07-09T00:00:00.000Z',
    hoursSpent: 2.5,
    evidenceRequired: false,
    evidenceUrl: '',
    status: 'APPROVED',
  },
];

const dashboardScores = {
  environmentalScore: 88,
  socialScore: 82,
  governanceScore: 91,
  overallScore: 87,
};

const emissionsTrend = [
  { month: 'Jan', emissions: 118 },
  { month: 'Feb', emissions: 112 },
  { month: 'Mar', emissions: 121 },
  { month: 'Apr', emissions: 109 },
  { month: 'May', emissions: 105 },
  { month: 'Jun', emissions: 101 },
  { month: 'Jul', emissions: 98 },
  { month: 'Aug', emissions: 96 },
  { month: 'Sep', emissions: 92 },
  { month: 'Oct', emissions: 90 },
  { month: 'Nov', emissions: 87 },
  { month: 'Dec', emissions: 84 },
];

const departmentRankings = [
  { name: 'Operations', score: 91 },
  { name: 'Logistics', score: 86 },
  { name: 'HR', score: 83 },
  { name: 'Supply Chain', score: 79 },
];

const activityFeed = [
  { id: 1, title: 'Priya completed Zero Waste Week', category: 'Environmental', time: '10m ago' },
  { id: 2, title: 'New compliance issue in Logistics', category: 'Governance', time: '1h ago' },
  { id: 3, title: 'Leo submitted CSR participation evidence', category: 'Social', time: '3h ago' },
];

const challenges = [
  {
    id: 1,
    title: 'Zero Waste Week',
    description: 'Reduce office waste by 20% this week.',
    status: 'Active',
    xp: 250,
    difficulty: 'Medium',
    deadline: '2026-07-20',
  },
  {
    id: 2,
    title: 'Green Commute Sprint',
    description: 'Log 5 carpool or transit days.',
    status: 'Under Review',
    xp: 180,
    difficulty: 'Easy',
    deadline: '2026-07-18',
  },
  {
    id: 3,
    title: 'Supplier Sustainability Audit',
    description: 'Complete audit responses for priority suppliers.',
    status: 'Completed',
    xp: 400,
    difficulty: 'Hard',
    deadline: '2026-07-12',
  },
];

const challengeParticipations = [
  { id: 1, challengeTitle: 'Zero Waste Week', employeeName: 'Priya Shah', status: 'Pending Approval' },
  { id: 2, challengeTitle: 'Green Commute Sprint', employeeName: 'Leo Chen', status: 'Submitted' },
];

const badgeGallery = [
  { id: 1, name: 'Climate Starter', description: 'Completed first carbon reduction challenge.', icon: '🌿' },
  { id: 2, name: 'Community Builder', description: 'Hosted two volunteer events.', icon: '🤝' },
  { id: 3, name: 'Governance Guardian', description: 'Maintained 100% policy acknowledgements.', icon: '🛡️' },
];

const leaderboard = [
  { rank: 1, name: 'Priya Shah • Operations', xp: 1640 },
  { rank: 2, name: 'Leo Chen • Supply Chain', xp: 1490 },
  { rank: 3, name: 'Ava Manager • HR', xp: 1380 },
];

export const getMockDepartments = () => Promise.resolve({ data: { success: true, data: departments } });
export const getMockEmissionFactors = () => Promise.resolve({ data: { success: true, data: emissionFactors } });
export const getMockCarbonTransactions = () => Promise.resolve({ data: { success: true, data: carbonTransactions } });
export const getMockCarbonSummary = (departmentId) => Promise.resolve({
  data: {
    success: true,
    data: {
      departmentId: Number(departmentId),
      totalEmissions: carbonTransactions.reduce((sum, transaction) => sum + transaction.quantity * (transaction.emissionFactor?.factor || 0), 0),
      trend: carbonTransactions.map((transaction) => ({
        date: transaction.createdAt.slice(0, 10),
        emissions: transaction.quantity * (transaction.emissionFactor?.factor || 0),
      })),
    },
  },
});
export const getMockComplianceItems = () => Promise.resolve({ data: { success: true, data: complianceItems } });
export const getMockCsrActivities = () => Promise.resolve({ data: { success: true, data: csrActivities } });
export const getMockOverallScores = () => Promise.resolve({ data: { success: true, data: dashboardScores } });
export const getMockEmissionsTrend = () => Promise.resolve({ data: { success: true, data: emissionsTrend } });
export const getMockDepartmentRankings = () => Promise.resolve({ data: { success: true, data: departmentRankings } });
export const getMockActivityFeed = () => Promise.resolve({ data: { success: true, data: activityFeed } });
export const getMockChallenges = () => Promise.resolve({ data: { success: true, data: challenges } });
export const getMockChallengeParticipations = () => Promise.resolve({ data: { success: true, data: challengeParticipations } });
export const getMockBadgeGallery = () => Promise.resolve({ data: { success: true, data: badgeGallery } });
export const getMockLeaderboard = () => Promise.resolve({ data: { success: true, data: leaderboard } });

export const mockSubmitCsrActivity = (payload) => Promise.resolve({
  data: {
    success: true,
    data: {
      id: Date.now(),
      ...payload,
      participant: { id: 2, name: 'Demo User' },
      date: new Date().toISOString(),
      status: 'PENDING_APPROVAL',
    },
  },
});

export const mockApproveCsrActivity = (id) => {
  const activity = csrActivities.find((item) => item.id === Number(id));
  if (activity) {
    activity.status = 'APPROVED';
  }
  return Promise.resolve({ data: { success: true, data: activity } });
};

export const mockRejectCsrActivity = (id) => {
  const activity = csrActivities.find((item) => item.id === Number(id));
  if (activity) {
    activity.status = 'REJECTED';
  }
  return Promise.resolve({ data: { success: true, data: activity } });
};

export const mockCreateComplianceIssue = (payload) => Promise.resolve({
  data: {
    success: true,
    data: {
      id: Date.now(),
      ...payload,
      status: 'PENDING',
      isOverdue: false,
      departmentId: Number(payload.departmentId || 1),
    },
  },
});

export const mockUpdateComplianceIssue = (payload) => {
  const issue = complianceItems.find((item) => item.id === Number(payload.id));
  if (issue) {
    Object.assign(issue, payload);
  }
  return Promise.resolve({ data: { success: true, data: issue } });
};

export const mockCreateCarbonTransaction = (payload) => Promise.resolve({
  data: {
    success: true,
    data: {
      id: Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      department: departments.find((department) => department.id === Number(payload.departmentId)) || null,
      emissionFactor: emissionFactors.find((factor) => factor.id === Number(payload.emissionFactorId)) || null,
    },
  },
});

export const mockLogin = (payload) => {
  const role = payload.email?.includes('manager') ? 'MANAGER' : 'EMPLOYEE';
  return Promise.resolve({
    data: {
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name: payload.name || 'Demo User',
        email: payload.email,
        role,
      },
    },
  });
};

export const mockRegister = (payload) => {
  const role = payload.role || (payload.email?.includes('manager') ? 'MANAGER' : 'EMPLOYEE');
  return Promise.resolve({
    data: {
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: 2,
        name: payload.name,
        email: payload.email,
        role,
      },
    },
  });
};
