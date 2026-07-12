import { prisma } from "@/lib/database/prisma";
import { getAuthedAccountId } from "@/lib/auth-server";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./errors";

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
 * Retrieves all connection groups belonging to the authenticated user, ordered by creation date.
 *
 * @returns An array of the authenticated user's connection groups.
 * @throws {AuthenticationError} If not authenticated.
 */
async function findConnectionGroupsByAccountId() {
  const accountId = await requireAuth();

  return prisma.connectionGroup.findMany({
    where: { accountId },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Finds a connection group by its unique ID.
 *
 * @param id - The connection group's unique identifier.
 * @returns The connection group record, or `null` if not found.
 */
function findConnectionGroupById(id: string) {
  return prisma.connectionGroup.findUnique({ where: { id } });
}

/**
 * Creates a new connection group for the authenticated user, optionally linking traits.
 *
 * @param name - The name for the new connection group.
 * @param traitIds - Optional array of trait IDs to connect to the group.
 * @returns The newly created connection group record.
 * @throws {AuthenticationError} If not authenticated.
 */
async function createConnectionGroup(name: string, traitIds?: string[]) {
  const accountId = await requireAuth();
  const traits = traitIds !== undefined ? traitIds.map((t) => ({ id: t })) : [];

  return prisma.connectionGroup.create({
    data: {
      name,
      accountId,
      ...(traits.length !== 0 ? { traits: { connect: traits } } : {}),
    },
  });
}

/**
 * Updates a connection group owned by the authenticated user.
 *
 * Verifies ownership before updating. Supports updating the group name,
 * replacing linked traits, and replacing linked connection sides.
 *
 * @param id - The connection group's unique identifier.
 * @param data - The fields to update (name, traitIds, connectionIds).
 * @returns The updated connection group record.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the connection group does not exist.
 * @throws {AuthorizationError} If the group is not owned by the authenticated user.
 */
async function updateConnectionGroup(
  id: string,
  data: { name?: string; traitIds?: string[]; connectionIds?: string[] },
) {
  const accountId = await requireAuth();
  const group = await prisma.connectionGroup.findUnique({ where: { id } });

  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");

  const { traitIds, connectionIds, ...rest } = data;
  const updateData: Record<string, unknown> = { ...rest };

  if (traitIds !== undefined) {
    updateData.traits = { set: traitIds.map((t) => ({ id: t })) };
  }

  if (connectionIds !== undefined) {
    const sides = await prisma.connectionSide.findMany({
      where: {
        accountId,
        connectionId: { in: connectionIds },
      },
    });
    updateData.sides = { set: sides.map((s) => ({ id: s.id })) };
  }

  return prisma.connectionGroup.update({ where: { id }, data: updateData });
}

/**
 * Deletes a connection group owned by the authenticated user.
 *
 * Verifies ownership before deleting.
 *
 * @param id - The connection group's unique identifier.
 * @returns The deleted connection group record.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the connection group does not exist.
 * @throws {AuthorizationError} If the group is not owned by the authenticated user.
 */
async function deleteConnectionGroup(id: string) {
  const accountId = await requireAuth();
  const group = await prisma.connectionGroup.findUnique({ where: { id } });

  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");

  return prisma.connectionGroup.delete({ where: { id } });
}

/**
 * Adds a trait to a connection group owned by the authenticated user.
 *
 * Verifies group ownership before connecting the trait.
 *
 * @param groupId - The connection group's unique identifier.
 * @param traitId - The trait's unique identifier to add.
 * @returns The updated connection group record.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the connection group does not exist.
 * @throws {AuthorizationError} If the group is not owned by the authenticated user.
 */
async function addTraitToGroup(groupId: string, traitId: string) {
  const accountId = await requireAuth();
  const group = await prisma.connectionGroup.findUnique({
    where: { id: groupId },
  });

  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");

  return prisma.connectionGroup.update({
    where: { id: groupId },
    data: { traits: { connect: { id: traitId } } },
  });
}

/**
 * Removes a trait from a connection group owned by the authenticated user.
 *
 * Verifies group ownership before disconnecting the trait. Returns the
 * updated group with its remaining traits included.
 *
 * @param groupId - The connection group's unique identifier.
 * @param traitId - The trait's unique identifier to remove.
 * @returns The updated connection group record with traits included.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the connection group does not exist.
 * @throws {AuthorizationError} If the group is not owned by the authenticated user.
 */
async function removeTraitFromGroup(groupId: string, traitId: string) {
  const accountId = await requireAuth();
  const group = await prisma.connectionGroup.findUnique({
    where: { id: groupId },
  });

  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");

  return prisma.connectionGroup.update({
    where: { id: groupId },
    data: { traits: { disconnect: [{ id: traitId }] } },
    include: { traits: true },
  });
}

/**
 * Finds the user account that owns a connection group.
 *
 * @param accountId - The account ID associated with the group.
 * @returns The user record, or `null` if not found.
 */
function findAccountForGroup(accountId: string) {
  return prisma.user.findUnique({ where: { id: accountId } });
}

/**
 * Finds all connections that have a side belonging to the given group.
 *
 * @param groupId - The connection group's unique identifier.
 * @returns An array of connections linked to the group via connection sides.
 */
function findConnectionsForGroup(groupId: string) {
  return prisma.connection.findMany({
    where: { sides: { some: { groups: { some: { id: groupId } } } } },
  });
}

/**
 * Finds all connection sides belonging to the given group.
 *
 * @param groupId - The connection group's unique identifier.
 * @returns An array of connection sides linked to the group.
 */
function findSidesForGroup(groupId: string) {
  return prisma.connectionSide.findMany({
    where: { groups: { some: { id: groupId } } },
  });
}

/**
 * Finds all traits linked to the given connection group.
 *
 * @param groupId - The connection group's unique identifier.
 * @returns An array of traits visible through the group.
 */
function findTraitsForGroup(groupId: string) {
  return prisma.trait.findMany({
    where: { visibleGroups: { some: { id: groupId } } },
  });
}

export const connectionGroup = {
  findConnectionGroupById,
  createConnectionGroup,
  updateConnectionGroup,
  deleteConnectionGroup,
  addTraitToGroup,
  removeTraitFromGroup,
};
export const search = {
  findConnectionGroupsByAccountId,
  findAccountForGroup,
  findConnectionsForGroup,
  findSidesForGroup,
  findTraitsForGroup,
};

const service = { connectionGroup, search };
export default service;
