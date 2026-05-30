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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.account.create({
            data: {
              id: user.id,
              displayName: user.name ?? "",
              username: user.email?.split("@")[0] ?? user.id.slice(0, 8),
              publicListed: true,
            },
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
