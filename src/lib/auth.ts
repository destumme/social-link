import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import { github } from "better-auth/social-providers";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/database/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  account: {
    modelName: "AuthAccount",
    accountLinking: {
      trustedProviders: ["github"],
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: github({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      mapProfileToUser(profile) {
        return {
          name: profile.name ?? profile.login,
          username: profile.login,
        };
      },
    }),
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
