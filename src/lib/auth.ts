import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { admin } from "better-auth/plugins";

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
  plugins: [username(), admin()],
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

export type Session = typeof auth.$Infer.Session;
