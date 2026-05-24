import { prisma } from "@/lib/database/prisma";

export function findAccountById(id: string) {
  return prisma.account.findUnique({ where: { id } });
}

export function findAccountsByUsername(username: string) {
  return prisma.account.findMany({
    where: {
      publicListed: true,
      username: {
        contains: username,
        mode: "default",
      },
    },
  });
}

export function updateAccount(
  accountId: string,
  data: { displayName?: string; username?: string; publicListed?: boolean },
) {
  return prisma.account.update({ where: { id: accountId }, data });
}

export function findAccountTraitsForOwner(accountId: string) {
  return prisma.trait.findMany({ where: { accountId } });
}

export function findAccountTraitsForViewer(
  accountId: string,
  viewerAccountId: string,
) {
  return prisma.trait.findMany({
    where: {
      visibleGroups: {
        some: {
          accountId: viewerAccountId,
          AND: {
            connections: {
              some: {
                accountId,
              },
            },
          },
        },
      },
    },
  });
}

export function findAccountConnections(accountId: string) {
  return prisma.connection.findMany({ where: { accountId } });
}

export function findAccountConnectionGroups(accountId: string) {
  return prisma.connectionGroup.findMany({ where: { accountId } });
}

export const account = { findAccountById, updateAccount };
export const search = {
  findAccountsByUsername,
  findAccountTraitsForOwner,
  findAccountTraitsForViewer,
  findAccountConnections,
  findAccountConnectionGroups,
};

const service = { account, search };
export default service;
