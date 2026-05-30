import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  cleanDatabase,
  getTestPrisma,
  setupTestDb,
  teardownTestDb,
} from "@/tests/helpers/testDb";

describe("Prisma DB connection", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  it("connects and runs a basic query", async () => {
    const prisma = getTestPrisma();
    const count = await prisma.user.count();
    expect(typeof count).toBe("number");
  });

  it("can create and delete a user", async () => {
    const prisma = getTestPrisma();

    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: "Integration Test",
        email: `integration-test-${Date.now()}@example.com`,
        emailVerified: false,
        displayName: "Integration Test",
        username: "integration-test-" + Date.now(),
      },
    });

    expect(user.id).toBeDefined();
    expect(user.displayName).toBe("Integration Test");

    await prisma.user.delete({ where: { id: user.id } });

    const deleted = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(deleted).toBeNull();
  });

  it("cleans database between tests", async () => {
    await cleanDatabase();
    const prisma = getTestPrisma();
    const count = await prisma.user.count();
    expect(count).toBe(0);
  });
});
