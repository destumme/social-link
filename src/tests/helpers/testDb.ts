import { prisma } from "@/lib/database/prisma";

export function getTestPrisma() {
  return prisma;
}

export async function setupTestDb() {
  await prisma.$connect();
  return prisma;
}

export async function teardownTestDb() {
  await prisma.$disconnect();
}

export async function cleanDatabase() {
  await prisma.$transaction([
    prisma.connectionGroup.deleteMany(),
    prisma.connection.deleteMany(),
    prisma.trait.deleteMany(),
    prisma.account.deleteMany(),
  ]);
}
