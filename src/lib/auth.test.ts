import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { testUtils } from "better-auth/plugins";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/database/prisma";

export const auth = betterAuth({
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
      displayName: { type: "string", required: false },
      publicListed: { type: "boolean", required: false },
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

export type Session = typeof auth.$Infer.Session;
