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
    departmentId: 1,
  },
  {
    id: 2,
    title: 'Diversity Training Review',
    framework: 'UNGC',
    dueDate: '2026-07-18T00:00:00.000Z',
    status: 'DONE',
    departmentId: 1,
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
  },
  {
    id: 2,
    title: 'Mentorship Session',
    description: 'Guided interns through sustainability reporting basics.',
    participantId: 1,
    participant: { id: 1, name: 'Ava Manager' },
    date: '2026-07-09T00:00:00.000Z',
    hoursSpent: 2.5,
  },
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
