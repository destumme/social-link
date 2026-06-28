"use server";

import { prisma } from "@/lib/database/prisma";
import { getAuthedAccountId } from "@/lib/auth-server";

export async function getLinkedProviders() {
  const accountId = await getAuthedAccountId();
  if (!accountId) {
    return { github: false };
  }

  const accounts = await prisma.authAccount.findMany({
    where: { userId: accountId },
    select: { providerId: true },
  });

  return {
    github: accounts.some((a) => a.providerId === "github"),
  };
}
