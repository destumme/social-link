import { betterAuth } from "better-auth";
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
  user: {
    additionalFields: {
      username: { type: "string", required: true },
      displayName: { type: "string", required: false },
      publicListed: { type: "boolean", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const defaults = {
            displayName: user.name ?? "",
            username:
              user.email?.split("@")[0].split("+").pop() ??
              crypto.randomUUID().slice(0, 8),
            publicListed: true,
          };
          return { data: { ...user, ...defaults } };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
