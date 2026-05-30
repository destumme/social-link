import { prisma } from "@/lib/database/prisma";

function findConnectionsByAccountId(accountId: string, status?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { accountId, ...(status !== null && { status }) };
  if (status !== null) {
    where.status = status;
  }

  return prisma.connection.findMany({
    where,
  });
}

function findPendingConnectionsForAccount(accountId: string) {
  return prisma.connection.findMany({
    where: { connectedAccountId: accountId, status: "PENDING" },
  });
}

function findConnectionBetweenAccounts(
  accountId: string,
  connectedAccountId: string,
) {
  return prisma.connection.findFirst({
    where: { accountId, connectedAccountId },
  });
}

function findConnectionById(id: string) {
  return prisma.connection.findUnique({ where: { id } });
}

async function findConnectionPair(id: string) {
  const connection = await prisma.connection.findUnique({ where: { id } });
  if (!connection) return null;
  const otherSide = await prisma.connection.findFirst({
    where: {
      accountId: connection.connectedAccountId,
      connectedAccountId: connection.accountId,
    },
  });
  return { connection, otherSide };
}

async function checkConnectionExists(
  accountId: string,
  connectedAccountId: string,
) {
  return prisma.connection.findFirst({
    where: {
      OR: [
        { accountId, connectedAccountId },
        { accountId: connectedAccountId, connectedAccountId: accountId },
      ],
    },
  });
}

async function createConnectionPair(
  fromAccountId: string,
  toAccountId: string,
  groupIds?: string[],
) {
  const gids = groupIds ?? [];
  const created = await prisma.connection.createManyAndReturn({
    data: [
      {
        accountId: fromAccountId,
        connectedAccountId: toAccountId,
        status: "PENDING",
        ...(gids.length > 0
          ? {
              connectionGroups: {
                connect: gids.map((id) => ({ id })),
              },
            }
          : {}),
      },
      {
        accountId: toAccountId,
        connectedAccountId: fromAccountId,
        status: "PENDING",
      },
    ],
  });
  return created.find((c) => c.accountId === fromAccountId);
}

async function acceptConnectionPair(connectionId: string, otherId: string) {
  const results = await prisma.$transaction([
    prisma.connection.update({
      where: { id: connectionId },
      data: { status: "ACCEPTED" },
    }),
    prisma.connection.update({
      where: { id: otherId },
      data: { status: "ACCEPTED" },
    }),
  ]);
  return results[0];
}

async function declineConnectionPair(connectionId: string, otherId: string) {
  const results = await prisma.$transaction([
    prisma.connection.update({
      where: { id: connectionId },
      data: { status: "DECLINED" },
    }),
    prisma.connection.update({
      where: { id: otherId },
      data: { status: "DECLINED" },
    }),
  ]);
  return results[0];
}

async function deleteConnectionPair(
  id: string,
  otherAccountId: string,
  otherConnectedAccountId: string,
) {
  await prisma.$transaction([
    prisma.connection.delete({ where: { id } }),
    prisma.connection.deleteMany({
      where: {
        accountId: otherAccountId,
        connectedAccountId: otherConnectedAccountId,
      },
    }),
  ]);
}

function addConnectionToGroup(connectionId: string, groupId: string) {
  return prisma.connection.update({
    where: { id: connectionId },
    data: { connectionGroups: { connect: { id: groupId } } },
  });
}

function removeConnectionFromGroup(connectionId: string, groupId: string) {
  return prisma.connection.update({
    where: { id: connectionId },
    data: { connectionGroups: { disconnect: { id: groupId } } },
  });
}

async function updateConnectionTraitGroups(
  connectionId: string,
  traitIds: string[],
) {
  const groups = await prisma.connectionGroup.findMany({
    where: { traits: { some: { id: { in: traitIds } } } },
  });
  return prisma.connection.update({
    where: { id: connectionId },
    data: {
      connectionGroups: {
        set: groups.map((g) => ({ id: g.id })),
      },
    },
  });
}

function findGroupsForConnection(connectionId: string) {
  return prisma.connectionGroup.findMany({
    where: { connections: { some: { id: connectionId } } },
  });
}

function findAccountForConnection(accountId: string) {
  return prisma.user.findUnique({ where: { id: accountId } });
}

function findConnectedAccountForConnection(connectedAccountId: string) {
  return prisma.user.findUnique({ where: { id: connectedAccountId } });
}

export const connection = {
  findConnectionById,
  addConnectionToGroup,
  removeConnectionFromGroup,
  updateConnectionTraitGroups,
};
export const connectionPair = {
  findConnectionPair,
  createConnectionPair,
  acceptConnectionPair,
  declineConnectionPair,
  deleteConnectionPair,
};
export const search = {
  findConnectionsByAccountId,
  findPendingConnectionsForAccount,
  findConnectionBetweenAccounts,
  checkConnectionExists,
  findGroupsForConnection,
  findAccountForConnection,
  findConnectedAccountForConnection,
};

const service = { connection, connectionPair, search };
export default service;
