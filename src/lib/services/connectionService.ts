import { prisma } from "@/lib/database/prisma";

export function findConnectionsByAccountId(accountId: string, status?: string) {
  const where: any = {accountId, ...(status !== null && {status})}
  if (status !== null) {
    where.status = status
  }

  return prisma.connection.findMany({
    where
  });
}

export function findPendingConnectionsForAccount(accountId: string) {
  return prisma.connection.findMany({
    where: { connectedAccountId: accountId, status: "PENDING" },
  });
}

export function findConnectionBetweenAccounts(
  accountId: string,
  connectedAccountId: string,
) {
  return prisma.connection.findFirst({
    where: { accountId, connectedAccountId },
  });
}

export function findConnectionById(id: string) {
  return prisma.connection.findUnique({ where: { id } });
}

export async function findConnectionPair(id: string) {
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

export async function checkConnectionExists(
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

export async function createConnectionPair(
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

export async function acceptConnectionPair(
  connectionId: string,
  otherId: string,
) {
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

export async function declineConnectionPair(
  connectionId: string,
  otherId: string,
) {
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

export async function deleteConnectionPair(
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

export function addConnectionToGroup(connectionId: string, groupId: string) {
  return prisma.connection.update({
    where: { id: connectionId },
    data: { connectionGroups: { connect: { id: groupId } } },
  });
}

export function removeConnectionFromGroup(
  connectionId: string,
  groupId: string,
) {
  return prisma.connection.update({
    where: { id: connectionId },
    data: { connectionGroups: { disconnect: { id: groupId } } },
  });
}

export async function updateConnectionTraitGroups(
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

export function findGroupsForConnection(connectionId: string) {
  return prisma.connectionGroup.findMany({
    where: { connections: { some: { id: connectionId } } },
  });
}

export function findAccountForConnection(accountId: string) {
  return prisma.account.findUnique({ where: { id: accountId } });
}

export function findConnectedAccountForConnection(connectedAccountId: string) {
  return prisma.account.findUnique({ where: { id: connectedAccountId } });
}
