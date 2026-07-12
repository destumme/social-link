import { prisma } from "@/lib/database/prisma";
import { getAuthedAccountId } from "@/lib/auth-server";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./errors";
import { ConnectionWhereInput } from "@/generated/prisma/models";
import { ConnectionStatus } from "@/generated/prisma/enums";

/**
 * Checks the current session and returns the authenticated account ID.
 *
 * @returns The authenticated account's ID.
 * @throws {AuthenticationError} If no valid session exists.
 */
async function requireAuth() {
  const accountId = await getAuthedAccountId();
  if (!accountId) throw new AuthenticationError("Not authenticated");
  return accountId;
}

/**
 * Retrieves all connections for the authenticated user filtered by status.
 *
 * @param status - The connection status to filter by (e.g., ACCEPTED, PENDING).
 * @returns An array of matching connections where the user is initiator or recipient.
 * @throws {AuthenticationError} If not authenticated.
 */
async function findConnectionsByAccountId(status: ConnectionStatus) {
  const accountId = await requireAuth();
  const where: ConnectionWhereInput = {
    OR: [{ initiatorId: accountId }, { recipientId: accountId }],
    AND: { status },
  };
  return prisma.connection.findMany({ where });
}

/**
 * Retrieves all pending incoming connection requests for the authenticated user.
 *
 * @returns An array of pending connections where the authenticated user is the recipient.
 * @throws {AuthenticationError} If not authenticated.
 */
async function findPendingConnectionsForAccount() {
  const accountId = await requireAuth();
  return prisma.connection.findMany({
    where: { recipientId: accountId, status: "PENDING" },
  });
}

/**
 * Finds an existing connection between the authenticated user and another account.
 *
 * @param connectedAccountId - The other account's unique identifier.
 * @returns The connection record, or `null` if none exists.
 * @throws {AuthenticationError} If not authenticated.
 */
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

/**
 * Finds a connection by its unique ID.
 *
 * @param id - The connection's unique identifier.
 * @returns The connection record, or `null` if not found.
 */
function findConnectionById(id: string) {
  return prisma.connection.findUnique({ where: { id } });
}

/**
 * Checks whether a connection already exists between the authenticated user
 * and the specified account, in either direction.
 *
 * @param connectedAccountId - The other account's unique identifier.
 * @returns The existing connection record, or `null` if none exists.
 * @throws {AuthenticationError} If not authenticated.
 */
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

/**
 * Creates a new pending connection request from the authenticated user to another account.
 *
 * Uses a transaction to atomically create both the connection record (with PENDING status)
 * and the initiator's connection side, optionally linking it to connection groups.
 *
 * @param toAccountId - The recipient account's unique identifier.
 * @param groupIds - Optional array of connection group IDs to link to the initiator's side.
 * @returns The newly created connection record.
 * @throws {AuthenticationError} If not authenticated.
 */
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

/**
 * Accepts a pending connection request addressed to the authenticated user.
 *
 * Uses a transaction to atomically update the connection status to ACCEPTED
 * and create the recipient's connection side.
 *
 * @param connectionId - The connection's unique identifier.
 * @returns The updated connection record with ACCEPTED status.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the connection does not exist.
 * @throws {AuthorizationError} If the authenticated user is not the recipient.
 */
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

/**
 * Declines a pending connection request addressed to the authenticated user.
 *
 * Updates the connection status to DECLINED.
 *
 * @param connectionId - The connection's unique identifier.
 * @returns The updated connection record with DECLINED status.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the connection does not exist.
 * @throws {AuthorizationError} If the authenticated user is not the recipient.
 */
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

/**
 * Deletes a connection that the authenticated user is a party to (initiator or recipient).
 *
 * @param id - The connection's unique identifier.
 * @returns void
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the connection does not exist.
 * @throws {AuthorizationError} If the authenticated user is neither initiator nor recipient.
 */
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

/**
 * Adds a connection to a connection group via the authenticated user's connection side.
 *
 * Validates that the connection is accepted, the user has a side on it,
 * and the user owns the target group.
 *
 * @param connectionId - The connection's unique identifier.
 * @param groupId - The connection group's unique identifier.
 * @returns The updated connection side record.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the connection or group does not exist.
 * @throws {AuthorizationError} If the connection is not accepted, the user has no side,
 *   or the user does not own the group.
 */
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

/**
 * Removes a connection from a connection group via the authenticated user's connection side.
 *
 * Validates that the user has a side on the connection and owns the target group.
 *
 * @param connectionId - The connection's unique identifier.
 * @param groupId - The connection group's unique identifier.
 * @returns The updated connection side record.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {AuthorizationError} If the user has no side on the connection or does not own the group.
 * @throws {NotFoundError} If the connection group does not exist.
 */
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

/**
 * Replaces all group memberships for the authenticated user's side of a connection.
 *
 * @param connectionId - The connection's unique identifier.
 * @param groupIds - The complete list of group IDs to set on the connection side.
 * @returns The updated connection side record.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {AuthorizationError} If the user has no side on the connection.
 */
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

/**
 * Updates the authenticated user's connection side groups based on trait associations.
 *
 * Finds all connection groups that contain any of the given traits, then replaces
 * the side's group memberships with those groups.
 *
 * @param connectionId - The connection's unique identifier.
 * @param traitIds - The trait IDs whose associated groups should be set on the side.
 * @returns The updated connection side record.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {AuthorizationError} If the user has no side on the connection.
 */
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

/**
 * Finds all connection groups linked to a given connection side.
 *
 * @param sideId - The connection side's unique identifier.
 * @returns An array of connection groups linked to the side.
 */
function findGroupsForSide(sideId: string) {
  return prisma.connectionGroup.findMany({
    where: { sides: { some: { id: sideId } } },
  });
}

/**
 * Finds all connection sides for a given connection.
 *
 * @param connectionId - The connection's unique identifier.
 * @returns An array of connection sides belonging to the connection.
 */
function findSidesForConnection(connectionId: string) {
  return prisma.connectionSide.findMany({
    where: { connectionId },
  });
}

/**
 * Finds a user by their unique ID.
 *
 * @param userId - The user's unique identifier.
 * @returns The user record, or `null` if not found.
 */
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
