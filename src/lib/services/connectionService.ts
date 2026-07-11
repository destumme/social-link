import { prisma } from "@/lib/database/prisma";
import { getAuthedAccountId } from "@/lib/auth-server";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./errors";
import { ConnectionWhereInput } from "@/generated/prisma/models";
import { ConnectionStatus } from "@/generated/prisma/enums";

async function requireAuth() {
  const accountId = await getAuthedAccountId();
  if (!accountId) throw new AuthenticationError("Not authenticated");
  return accountId;
}

async function findConnectionsByAccountId(status: ConnectionStatus) {
  const accountId = await requireAuth();
  const where: ConnectionWhereInput = {
    OR: [{ initiatorId: accountId }, { recipientId: accountId }],
    AND: { status },
  };
  return prisma.connection.findMany({ where });
}

async function findPendingConnectionsForAccount() {
  const accountId = await requireAuth();
  return prisma.connection.findMany({
    where: { recipientId: accountId, status: "PENDING" },
  });
}

async function findConnectionBetweenAccounts(connectedAccountId: string) {
  const accountId = await requireAuth();
  return prisma.connection.findFirst({
    where: {
      OR: [
        { initiatorId: accountId, recipientId: connectedAccountId },
        { initiatorId: connectedAccountId, recipientId: accountId },
      ],
    },
  });
}

function findConnectionById(id: string) {
  return prisma.connection.findUnique({ where: { id } });
}

async function checkConnectionExists(connectedAccountId: string) {
  const accountId = await requireAuth();
  return prisma.connection.findFirst({
    where: {
      OR: [
        { initiatorId: accountId, recipientId: connectedAccountId },
        { initiatorId: connectedAccountId, recipientId: accountId },
      ],
    },
  });
}

async function createConnectionPair(toAccountId: string, groupIds?: string[]) {
  const fromAccountId = await requireAuth();
  const gids = groupIds ?? [];

  return prisma.$transaction(async (tx) => {
    const connection = await tx.connection.create({
      data: {
        initiatorId: fromAccountId,
        recipientId: toAccountId,
        status: "PENDING",
      },
    });

    await tx.connectionSide.create({
      data: {
        connectionId: connection.id,
        accountId: fromAccountId,
        ...(gids.length > 0
          ? { groups: { connect: gids.map((id) => ({ id })) } }
          : {}),
      },
    });

    return connection;
  });
}

async function acceptConnectionPair(connectionId: string) {
  const accountId = await requireAuth();

  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) throw new NotFoundError("Connection not found");
  if (connection.recipientId !== accountId)
    throw new AuthorizationError("Not authorized");

  return prisma.$transaction(async (tx) => {
    const updated = await tx.connection.update({
      where: { id: connectionId },
      data: { status: "ACCEPTED" },
    });

    await tx.connectionSide.create({
      data: {
        connectionId,
        accountId,
      },
    });

    return updated;
  });
}

async function declineConnectionPair(connectionId: string) {
  const accountId = await requireAuth();

  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) throw new NotFoundError("Connection not found");
  if (connection.recipientId !== accountId)
    throw new AuthorizationError("Not authorized");

  return prisma.connection.update({
    where: { id: connectionId },
    data: { status: "DECLINED" },
  });
}

async function deleteConnectionPair(id: string) {
  const accountId = await requireAuth();

  const connection = await prisma.connection.findUnique({
    where: { id },
  });

  if (!connection) throw new NotFoundError("Connection not found");
  if (
    connection.initiatorId !== accountId &&
    connection.recipientId !== accountId
  )
    throw new AuthorizationError("Not authorized");

  await prisma.connection.delete({ where: { id } });
}

async function addConnectionToGroup(connectionId: string, groupId: string) {
  const accountId = await requireAuth();

  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) throw new NotFoundError("Connection not found");
  if (connection.status !== "ACCEPTED") {
    throw new AuthorizationError("Connection not accepted");
  }

  const side = await prisma.connectionSide.findUnique({
    where: {
      connectionId_accountId: {
        connectionId,
        accountId,
      },
    },
  });
  if (!side) throw new AuthorizationError("Not authorized");

  const group = await prisma.connectionGroup.findUnique({
    where: { id: groupId },
  });

  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");

  return prisma.connectionSide.update({
    where: { id: side.id },
    data: { groups: { connect: { id: groupId } } },
  });
}

async function removeConnectionFromGroup(
  connectionId: string,
  groupId: string,
) {
  const accountId = await requireAuth();

  const side = await prisma.connectionSide.findUnique({
    where: {
      connectionId_accountId: {
        connectionId,
        accountId,
      },
    },
  });
  if (!side) throw new AuthorizationError("Not authorized");

  const group = await prisma.connectionGroup.findUnique({
    where: { id: groupId },
  });
  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");

  return prisma.connectionSide.update({
    where: { id: side.id },
    data: { groups: { disconnect: { id: groupId } } },
  });
}

async function updateConnectionGroups(
  connectionId: string,
  groupIds: string[],
) {
  const accountId = await requireAuth();

  const side = await prisma.connectionSide.findUnique({
    where: {
      connectionId_accountId: {
        connectionId,
        accountId,
      },
    },
  });
  if (!side) throw new AuthorizationError("Not authorized");

  return prisma.connectionSide.update({
    where: { id: side.id },
    data: {
      groups: {
        set: groupIds.map((id) => ({ id })),
      },
    },
  });
}

async function updateConnectionTraitGroups(
  connectionId: string,
  traitIds: string[],
) {
  const accountId = await requireAuth();

  const side = await prisma.connectionSide.findUnique({
    where: {
      connectionId_accountId: {
        connectionId,
        accountId,
      },
    },
  });
  if (!side) throw new AuthorizationError("Not authorized");

  const groups = await prisma.connectionGroup.findMany({
    where: { traits: { some: { id: { in: traitIds } } } },
  });

  return prisma.connectionSide.update({
    where: { id: side.id },
    data: {
      groups: {
        set: groups.map((g) => ({ id: g.id })),
      },
    },
  });
}

function findGroupsForSide(sideId: string) {
  return prisma.connectionGroup.findMany({
    where: { sides: { some: { id: sideId } } },
  });
}

function findSidesForConnection(connectionId: string) {
  return prisma.connectionSide.findMany({
    where: { connectionId },
  });
}

function findUserById(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}

export const connection = {
  findConnectionById,
  addConnectionToGroup,
  removeConnectionFromGroup,
  updateConnectionTraitGroups,
  updateConnectionGroups,
};
export const connectionPair = {
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
  findGroupsForSide,
  findSidesForConnection,
  findUserById,
};

const service = { connection, connectionPair, search };
export default service;
