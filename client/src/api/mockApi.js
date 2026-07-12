const metrics = [
  {
    id: 1,
    type: 'ENVIRONMENTAL',
    name: 'Energy Consumption',
    value: 184.2,
    unit: 'kWh',
    departmentId: 1,
    submittedBy: { id: 1, name: 'Ava Manager' },
    date: '2026-07-10T00:00:00.000Z',
  },
  {
    id: 2,
    type: 'SOCIAL',
    name: 'Training Completion',
    value: 92,
    unit: '%',
    departmentId: 1,
    submittedBy: { id: 2, name: 'Leo Employee' },
    date: '2026-07-11T00:00:00.000Z',
  },
  {
    id: 3,
    type: 'GOVERNANCE',
    name: 'Policy Compliance',
    value: 88,
    unit: '%',
    departmentId: 1,
    submittedBy: { id: 1, name: 'Ava Manager' },
    date: '2026-07-12T00:00:00.000Z',
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

export const getMockMetrics = () => Promise.resolve({ data: { success: true, data: metrics } });
export const getMockComplianceItems = () => Promise.resolve({ data: { success: true, data: complianceItems } });
export const getMockCsrActivities = () => Promise.resolve({ data: { success: true, data: csrActivities } });

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
