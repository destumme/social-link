import { betterAuth } from "better-auth";
import { testUtils, username } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/database/prisma";

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  account: {
    modelName: "AuthAccount",
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), testUtils()],
  user: {
    additionalFields: {
      displayName: { type: "string" as const, required: false },
      publicListed: { type: "boolean" as const, required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              displayName: user.name ?? "",
              publicListed: true,
            },
          };
        },
      },
    },
  },
});

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
    },
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
