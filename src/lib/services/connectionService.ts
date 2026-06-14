import { prisma } from "@/lib/database/prisma";
import { getAuthedAccountId } from "@/lib/auth-server";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./errors";

async function requireAuth() {
  const accountId = await getAuthedAccountId();
  if (!accountId) throw new AuthenticationError("Not authenticated");
  return accountId;
}

async function findConnectionsByAccountId(status?: string | null) {
  const accountId = await requireAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { accountId };
  if (status !== null && status !== undefined) {
    where.status = status;
  }
  return prisma.connection.findMany({ where });
}

async function findPendingConnectionsForAccount() {
  const accountId = await requireAuth();
  return prisma.connection.findMany({
    where: { connectedAccountId: accountId, status: "PENDING" },
  });
}

async function findConnectionBetweenAccounts(connectedAccountId: string) {
  const accountId = await requireAuth();
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

async function checkConnectionExists(connectedAccountId: string) {
  const accountId = await requireAuth();
  return prisma.connection.findFirst({
    where: {
      OR: [
        { accountId, connectedAccountId },
        { accountId: connectedAccountId, connectedAccountId: accountId },
      ],
    },
  });
}

async function createConnectionPair(toAccountId: string, groupIds?: string[]) {
  const fromAccountId = await requireAuth();
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
  const accountId = await requireAuth();
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });
  if (!connection) throw new NotFoundError("Connection not found");
  if (connection.connectedAccountId !== accountId)
    throw new AuthorizationError("Not authorized");
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
  const accountId = await requireAuth();
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });
  if (!connection) throw new NotFoundError("Connection not found");
  if (connection.connectedAccountId !== accountId)
    throw new AuthorizationError("Not authorized");
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
  const accountId = await requireAuth();
  const connection = await prisma.connection.findUnique({ where: { id } });
  if (!connection) throw new NotFoundError("Connection not found");
  if (
    connection.accountId !== accountId &&
    connection.connectedAccountId !== accountId
  )
    throw new AuthorizationError("Not authorized");
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

async function addConnectionToGroup(connectionId: string, groupId: string) {
  const accountId = await requireAuth();
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });
  if (!connection) throw new NotFoundError("Connection not found");
  if (connection.accountId !== accountId)
    throw new AuthorizationError("Not authorized");
  const group = await prisma.connectionGroup.findUnique({
    where: { id: groupId },
  });
  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");
  return prisma.connection.update({
    where: { id: connectionId },
    data: { connectionGroups: { connect: { id: groupId } } },
  });
}

async function removeConnectionFromGroup(
  connectionId: string,
  groupId: string,
) {
  const accountId = await requireAuth();
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });
  if (!connection) throw new NotFoundError("Connection not found");
  if (connection.accountId !== accountId)
    throw new AuthorizationError("Not authorized");
  const group = await prisma.connectionGroup.findUnique({
    where: { id: groupId },
  });
  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");
  return prisma.connection.update({
    where: { id: connectionId },
    data: { connectionGroups: { disconnect: { id: groupId } } },
  });
}

async function updateConnectionTraitGroups(
  connectionId: string,
  traitIds: string[],
) {
  const accountId = await requireAuth();
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });
  if (!connection) throw new NotFoundError("Connection not found");
  if (connection.accountId !== accountId)
    throw new AuthorizationError("Not authorized");
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
