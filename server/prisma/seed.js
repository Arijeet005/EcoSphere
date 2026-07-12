import bcrypt from 'bcrypt';
import prisma from '../config/db.js';

const getOrCreate = async ({ find, create }) => {
  const existing = await find();
  return existing || create();
};

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const operations = await prisma.department.upsert({
    where: { name: 'Operations' },
    update: {},
    create: { name: 'Operations' },
  });

  const facilities = await prisma.department.upsert({
    where: { name: 'Facilities' },
    update: {},
    create: { name: 'Facilities' },
  });

  const operationsManager = await prisma.user.upsert({
    where: { email: 'ops.manager@ecosphere.com' },
    update: {
      name: 'Ava Operations',
      passwordHash,
      role: 'MANAGER',
      departmentId: operations.id,
    },
    create: {
      name: 'Ava Operations',
      email: 'ops.manager@ecosphere.com',
      passwordHash,
      role: 'MANAGER',
      departmentId: operations.id,
    },
  });

  const operationsEmployee = await prisma.user.upsert({
    where: { email: 'ops.employee@ecosphere.com' },
    update: {
      name: 'Leo Operations',
      passwordHash,
      role: 'EMPLOYEE',
      departmentId: operations.id,
      points: 40,
      xp: 120,
    },
    create: {
      name: 'Leo Operations',
      email: 'ops.employee@ecosphere.com',
      passwordHash,
      role: 'EMPLOYEE',
      departmentId: operations.id,
      points: 40,
      xp: 120,
    },
  });

  const facilitiesManager = await prisma.user.upsert({
    where: { email: 'facilities.manager@ecosphere.com' },
    update: {
      name: 'Mira Facilities',
      passwordHash,
      role: 'MANAGER',
      departmentId: facilities.id,
    },
    create: {
      name: 'Mira Facilities',
      email: 'facilities.manager@ecosphere.com',
      passwordHash,
      role: 'MANAGER',
      departmentId: facilities.id,
    },
  });

  const facilitiesEmployee = await prisma.user.upsert({
    where: { email: 'facilities.employee@ecosphere.com' },
    update: {
      name: 'Noah Facilities',
      passwordHash,
      role: 'EMPLOYEE',
      departmentId: facilities.id,
      points: 20,
      xp: 60,
    },
    create: {
      name: 'Noah Facilities',
      email: 'facilities.employee@ecosphere.com',
      passwordHash,
      role: 'EMPLOYEE',
      departmentId: facilities.id,
      points: 20,
      xp: 60,
    },
  });

  const carbonCategory = await prisma.category.upsert({
    where: { name: 'Carbon Reduction' },
    update: {},
    create: { name: 'Carbon Reduction', description: 'Actions that reduce operational emissions.' },
  });

  const communityCategory = await prisma.category.upsert({
    where: { name: 'Community Impact' },
    update: {},
    create: { name: 'Community Impact', description: 'Social impact and employee volunteering.' },
  });

  const electricityFactor = await getOrCreate({
    find: () => prisma.emissionFactor.findFirst({ where: { name: 'Grid Electricity', category: 'Energy' } }),
    create: () =>
      prisma.emissionFactor.create({
        data: {
          name: 'Grid Electricity',
          category: 'Energy',
          categoryId: carbonCategory.id,
          unit: 'kWh',
          co2PerUnit: 0.42,
          createdById: operationsManager.id,
        },
      }),
  });

  const dieselFactor = await getOrCreate({
    find: () => prisma.emissionFactor.findFirst({ where: { name: 'Diesel Fuel', category: 'Fuel' } }),
    create: () =>
      prisma.emissionFactor.create({
        data: {
          name: 'Diesel Fuel',
          category: 'Fuel',
          categoryId: carbonCategory.id,
          unit: 'liter',
          co2PerUnit: 2.68,
          createdById: facilitiesManager.id,
        },
      }),
  });

  const travelFactor = await getOrCreate({
    find: () => prisma.emissionFactor.findFirst({ where: { name: 'Business Travel', category: 'Travel' } }),
    create: () =>
      prisma.emissionFactor.create({
        data: {
          name: 'Business Travel',
          category: 'Travel',
          categoryId: carbonCategory.id,
          unit: 'km',
          co2PerUnit: 0.18,
          createdById: operationsManager.id,
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.carbonTransaction.findFirst({ where: { departmentId: operations.id, emissionFactorId: electricityFactor.id } }),
    create: () =>
      prisma.carbonTransaction.create({
        data: {
          departmentId: operations.id,
          emissionFactorId: electricityFactor.id,
          quantity: 2400,
          calculatedEmission: 2400 * electricityFactor.co2PerUnit,
          createdById: operationsManager.id,
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.carbonTransaction.findFirst({ where: { departmentId: facilities.id, emissionFactorId: dieselFactor.id } }),
    create: () =>
      prisma.carbonTransaction.create({
        data: {
          departmentId: facilities.id,
          emissionFactorId: dieselFactor.id,
          quantity: 180,
          calculatedEmission: 180 * dieselFactor.co2PerUnit,
          createdById: facilitiesManager.id,
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.carbonTransaction.findFirst({ where: { departmentId: operations.id, emissionFactorId: travelFactor.id } }),
    create: () =>
      prisma.carbonTransaction.create({
        data: {
          departmentId: operations.id,
          emissionFactorId: travelFactor.id,
          quantity: 620,
          calculatedEmission: 620 * travelFactor.co2PerUnit,
          createdById: operationsManager.id,
        },
      }),
  });

  const parkCleanup = await getOrCreate({
    find: () => prisma.cSRActivity.findFirst({ where: { title: 'Neighborhood Park Cleanup' } }),
    create: () =>
      prisma.cSRActivity.create({
        data: {
          title: 'Neighborhood Park Cleanup',
          description: 'Employee volunteering event for local green space restoration.',
          departmentId: operations.id,
          activityDate: daysFromNow(-8),
          hoursSpent: 6,
          evidenceRequired: true,
          pointsValue: 40,
        },
      }),
  });

  const mentoring = await getOrCreate({
    find: () => prisma.cSRActivity.findFirst({ where: { title: 'STEM Mentoring Workshop' } }),
    create: () =>
      prisma.cSRActivity.create({
        data: {
          title: 'STEM Mentoring Workshop',
          description: 'Mentoring session for local students.',
          departmentId: facilities.id,
          activityDate: daysFromNow(-4),
          hoursSpent: 4,
          evidenceRequired: false,
          pointsValue: 20,
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.employeeParticipation.findFirst({ where: { userId: operationsEmployee.id, csrActivityId: parkCleanup.id } }),
    create: () =>
      prisma.employeeParticipation.create({
        data: {
          userId: operationsEmployee.id,
          csrActivityId: parkCleanup.id,
          proofUrl: 'https://example.com/evidence/park-cleanup',
          pointsEarned: 40,
          status: 'APPROVED',
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.employeeParticipation.findFirst({ where: { userId: facilitiesEmployee.id, csrActivityId: mentoring.id } }),
    create: () =>
      prisma.employeeParticipation.create({
        data: {
          userId: facilitiesEmployee.id,
          csrActivityId: mentoring.id,
          pointsEarned: 20,
          status: 'APPROVED',
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.complianceIssue.findFirst({ where: { title: 'Quarterly ESG Disclosure Review' } }),
    create: () =>
      prisma.complianceIssue.create({
        data: {
          departmentId: operations.id,
          ownerId: operationsManager.id,
          title: 'Quarterly ESG Disclosure Review',
          description: 'Review disclosure package before board submission.',
          severity: 'MEDIUM',
          status: 'CLOSED',
          dueDate: daysFromNow(-14),
          isResolved: true,
          resolvedAt: daysFromNow(-10),
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.complianceIssue.findFirst({ where: { title: 'Facility Safety Audit Evidence' } }),
    create: () =>
      prisma.complianceIssue.create({
        data: {
          departmentId: facilities.id,
          ownerId: facilitiesManager.id,
          title: 'Facility Safety Audit Evidence',
          description: 'Upload overdue evidence for annual facility safety audit.',
          severity: 'HIGH',
          status: 'OPEN',
          dueDate: daysFromNow(-3),
          isResolved: false,
        },
      }),
  });

  const energyChallenge = await getOrCreate({
    find: () => prisma.challenge.findFirst({ where: { title: 'Reduce Office Energy Use' } }),
    create: () =>
      prisma.challenge.create({
        data: {
          title: 'Reduce Office Energy Use',
          description: 'Track team actions that reduce electricity consumption.',
          departmentId: operations.id,
          categoryId: carbonCategory.id,
          createdById: operationsManager.id,
          startDate: daysFromNow(-10),
          endDate: daysFromNow(20),
          status: 'ACTIVE',
          evidenceRequired: true,
          xpReward: 120,
        },
      }),
  });

  const zeroWasteChallenge = await getOrCreate({
    find: () => prisma.challenge.findFirst({ where: { title: 'Zero Waste Week' } }),
    create: () =>
      prisma.challenge.create({
        data: {
          title: 'Zero Waste Week',
          description: 'Submit waste reduction progress for review.',
          departmentId: facilities.id,
          categoryId: carbonCategory.id,
          createdById: facilitiesManager.id,
          startDate: daysFromNow(-3),
          endDate: daysFromNow(11),
          status: 'UNDER_REVIEW',
          evidenceRequired: false,
          xpReward: 60,
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.challengeParticipation.findUnique({
      where: { challengeId_userId: { challengeId: energyChallenge.id, userId: operationsEmployee.id } },
    }),
    create: () =>
      prisma.challengeParticipation.create({
        data: {
          challengeId: energyChallenge.id,
          userId: operationsEmployee.id,
          status: 'APPROVED',
          progressValue: 100,
          evidenceUrl: 'https://example.com/evidence/energy-reduction',
          submissionNote: 'Submitted smart scheduling and shutdown checklist evidence.',
          xpAwarded: 120,
          submittedAt: daysFromNow(-2),
          reviewedAt: daysFromNow(-1),
          reviewedById: operationsManager.id,
          completedAt: daysFromNow(-1),
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.challengeParticipation.findUnique({
      where: { challengeId_userId: { challengeId: zeroWasteChallenge.id, userId: facilitiesEmployee.id } },
    }),
    create: () =>
      prisma.challengeParticipation.create({
        data: {
          challengeId: zeroWasteChallenge.id,
          userId: facilitiesEmployee.id,
          status: 'SUBMITTED',
          progressValue: 75,
          submissionNote: 'Waste sorting progress submitted for review.',
          submittedAt: daysFromNow(-1),
        },
      }),
  });

  const xpStarterBadge = await getOrCreate({
    find: () => prisma.badge.findFirst({ where: { name: 'XP Starter', categoryId: communityCategory.id } }),
    create: () =>
      prisma.badge.create({
        data: {
          name: 'XP Starter',
          description: 'Awarded after earning at least 50 XP.',
          categoryId: communityCategory.id,
          unlockRule: { minXp: 50 },
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.badge.findFirst({ where: { name: 'Challenge Champion', categoryId: carbonCategory.id } }),
    create: () =>
      prisma.badge.create({
        data: {
          name: 'Challenge Champion',
          description: 'Awarded after completing one challenge and earning 100 XP.',
          categoryId: carbonCategory.id,
          unlockRule: { minXp: 100, minCompletedChallenges: 1 },
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.employeeParticipation.findFirst({ where: { userId: operationsEmployee.id, badgeId: xpStarterBadge.id } }),
    create: () =>
      prisma.employeeParticipation.create({
        data: {
          userId: operationsEmployee.id,
          badgeId: xpStarterBadge.id,
          status: 'APPROVED',
        },
      }),
  });

  await getOrCreate({
    find: () => prisma.reward.findFirst({ where: { name: 'Reusable Bottle Voucher', categoryId: communityCategory.id } }),
    create: () =>
      prisma.reward.create({
        data: {
          name: 'Reusable Bottle Voucher',
          description: 'Redeem points for a reusable bottle voucher.',
          categoryId: communityCategory.id,
          pointsCost: 50,
        },
      }),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
