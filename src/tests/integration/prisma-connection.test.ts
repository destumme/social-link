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
    const count = await prisma.account.count();
    expect(typeof count).toBe("number");
  });

  it("can create and delete an account", async () => {
    const prisma = getTestPrisma();

    const account = await prisma.account.create({
      data: {
        displayName: "Integration Test",
        username: "integration-test-" + Date.now(),
      },
    });

    expect(account.id).toBeDefined();
    expect(account.displayName).toBe("Integration Test");

    await prisma.account.delete({ where: { id: account.id } });

    const deleted = await prisma.account.findUnique({
      where: { id: account.id },
    });
    expect(deleted).toBeNull();
  });

  it("cleans database between tests", async () => {
    await cleanDatabase();
    const prisma = getTestPrisma();
    const count = await prisma.account.count();
    expect(count).toBe(0);
  });
});
