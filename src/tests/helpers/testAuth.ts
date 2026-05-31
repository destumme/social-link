import { auth } from "@/lib/auth.test";
import type { TestHelpers } from "better-auth/plugins";

let testHelpers: TestHelpers | null = null;

async function getTestHelpers(): Promise<TestHelpers> {
  if (!testHelpers) {
    const ctx = await auth.$context;
    testHelpers = ctx.test;
  }
  return testHelpers;
}

export interface TestUserResult {
  user: { id: string; email: string; name: string };
  headers: Headers;
}

export async function createTestUser(overrides?: {
  email?: string;
  name?: string;
}): Promise<TestUserResult> {
  const test = await getTestHelpers();
  const username = `testuser-${Date.now()}`;
  const user = test.createUser({
    email: overrides?.email ?? `test-${Date.now()}@example.com`,
    name: overrides?.name ?? "Test User",
    username,
  });
  await test.saveUser(user);
  const { headers } = await test.login({ userId: user.id });
  return { user, headers };
}

export async function cleanupTestUser(userId: string): Promise<void> {
  const test = await getTestHelpers();
  await test.deleteUser(userId);
}
