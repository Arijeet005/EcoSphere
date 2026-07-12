import { PrismaClient } from '@prisma/client';

const passwords = [
  'postgres',
  'admin',
  'root',
  'password',
  '123456',
  '123',
  'ecosphere',
  'isha',
  'arijeet',
  'Arijeet005',
  'ops.manager',
  ''
];

async function testPassword(password) {
  const url = `postgresql://postgres:${password}@localhost:5432/ecosphere`;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    await prisma.$connect();
    console.log(`SUCCESS: Password is "${password}"`);
    await prisma.$disconnect();
    return true;
  } catch (err) {
    console.log(`FAILED: Password "${password}" - ${err.message}`);
    await prisma.$disconnect();
    return false;
  }
}

async function run() {
  for (const pw of passwords) {
    const success = await testPassword(pw);
    if (success) {
      process.exit(0);
    }
  }
  console.log("None of the tested passwords worked.");
  process.exit(1);
}

run();
