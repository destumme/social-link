import { prisma } from "@/lib/database/prisma";

function findAccountById(id: string) {
  return prisma.account.findUnique({ where: { id } });
}

function findAccountsByUsername(username: string) {
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

function updateAccount(
  accountId: string,
  data: { displayName?: string; username?: string; publicListed?: boolean },
) {
  return prisma.account.update({ where: { id: accountId }, data });
}

function findAccountTraitsForOwner(accountId: string) {
  return prisma.trait.findMany({ where: { accountId } });
}

function findAccountTraitsForViewer(
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

function findAccountConnections(accountId: string) {
  return prisma.connection.findMany({ where: { accountId } });
}

function findAccountConnectionGroups(accountId: string) {
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
