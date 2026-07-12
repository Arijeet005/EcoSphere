import bcrypt from 'bcrypt';
import prisma from '../config/db.js';

async function main() {
  const department = await prisma.department.upsert({
    where: { name: 'Operations' },
    update: {},
    create: { name: 'Operations' },
  });

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@ecosphere.com' },
    update: {},
    create: {
      name: 'Ava Manager',
      email: 'manager@ecosphere.com',
      passwordHash,
      role: 'MANAGER',
      departmentId: department.id,
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@ecosphere.com' },
    update: {},
    create: {
      name: 'Leo Employee',
      email: 'employee@ecosphere.com',
      passwordHash,
      role: 'EMPLOYEE',
      departmentId: department.id,
    },
  });

  await prisma.esgMetric.createMany({
    data: [
      {
        type: 'ENVIRONMENTAL',
        name: 'Energy Consumption',
        value: 184.2,
        unit: 'kWh',
        departmentId: department.id,
        submittedById: manager.id,
        date: new Date('2026-07-10'),
      },
      {
        type: 'SOCIAL',
        name: 'Training Completion',
        value: 92,
        unit: '%',
        departmentId: department.id,
        submittedById: employee.id,
        date: new Date('2026-07-11'),
      },
      {
        type: 'GOVERNANCE',
        name: 'Policy Compliance',
        value: 88,
        unit: '%',
        departmentId: department.id,
        submittedById: manager.id,
        date: new Date('2026-07-12'),
      },
      {
        type: 'ENVIRONMENTAL',
        name: 'Waste Reduction',
        value: 37.5,
        unit: 'tonnes',
        departmentId: department.id,
        submittedById: employee.id,
        date: new Date('2026-07-12'),
      },
    ],
    skipDuplicates: true,
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
