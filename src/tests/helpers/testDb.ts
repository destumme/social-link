import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

let testPrisma: PrismaClient | null = null;

export function getTestPrisma(): PrismaClient {
  if (!testPrisma) {
    const connectionString = process.env.DATABASE_URL ?? "";
    const adapter = new PrismaPg({ connectionString });
    testPrisma = new PrismaClient({ adapter });
  }
  return testPrisma;
}

export async function setupTestDb() {
  const prisma = getTestPrisma();
  await prisma.$connect();
  return prisma;
}

export async function teardownTestDb() {
  const prisma = getTestPrisma();
  await prisma.$disconnect();
  testPrisma = null;
}

export async function cleanDatabase() {
  const prisma = getTestPrisma();
  await prisma.$transaction([
    prisma.connectionGroup.deleteMany(),
    prisma.connection.deleteMany(),
    prisma.trait.deleteMany(),
    prisma.account.deleteMany(),
  ]);
}
