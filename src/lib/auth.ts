import { betterAuth, BetterAuthOptions } from "better-auth";
import { username } from "better-auth/plugins";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/database/prisma";

export const authOptions: BetterAuthOptions = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  account: {
    modelName: "AuthAccount",
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
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
};

export const auth = betterAuth(authOptions);

export type Session = typeof auth.$Infer.Session;
