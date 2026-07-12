import { PrismaClient } from '@prisma/client';

async function run() {
  // Connect to the default 'postgres' database
  const url = `postgresql://postgres:postgres@localhost:5432/postgres`;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    await prisma.$connect();
    console.log('Connected to default postgres database.');
    
    // Refresh collation on template1
    await prisma.$executeRawUnsafe('ALTER DATABASE template1 REFRESH COLLATION VERSION');
    console.log('Refreshed collation version on template1.');

    // Try creating the ecosphere database
    try {
      await prisma.$executeRawUnsafe('CREATE DATABASE ecosphere');
      console.log('Database "ecosphere" created successfully.');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('Database "ecosphere" already exists.');
      } else {
        throw err;
      }
    }
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

run();
