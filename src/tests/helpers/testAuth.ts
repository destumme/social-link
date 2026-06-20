import { authOptions } from "@/lib/auth";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { testUtils } from "better-auth/plugins";

const testOptions: BetterAuthOptions = {
  ...authOptions,
  plugins: [...(authOptions.plugins ?? []), testUtils()],
};

const auth = betterAuth(testOptions);

export interface TestUserResult {
  user: { id: string; email: string; name: string };
  headers: Headers;
}

export async function createTestUser(overrides?: {
  email?: string;
  name?: string;
}): Promise<TestUserResult> {
  const email = overrides?.email ?? `test-${Date.now()}@example.com`;
  const name = overrides?.name ?? "Test User";
  const username = `tu${Date.now().toString(36)}`;
  const password = "testpassword123";

  await auth.api.signUpEmail({
    body: {
      email,
      name,
      username,
      password,
      // inference is broken from the spread with the username plugin
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });

  const { headers, response } = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    returnHeaders: true,
  });

  const sessionHeaders = new Headers();
  for (const cookie of headers.getSetCookie()) {
    sessionHeaders.append("Cookie", cookie.split(";")[0]);
  }

  return {
    user: {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    },
    headers: sessionHeaders,
  };
}

export async function cleanupTestUser(_userId: string): Promise<void> {
  // Cleanup is handled by cleanDatabase() in beforeEach
}
