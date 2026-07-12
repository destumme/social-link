import { prisma } from "@/lib/database/prisma";
import { getAuthedAccountId } from "@/lib/auth-server";
import { AuthenticationError } from "./errors";

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
 * Finds a user by their unique ID.
 *
 * @param id - The user's unique identifier.
 * @returns The user record, or `null` if not found.
 */
function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

/**
 * Finds a user by username and returns their profile with visible traits,
 * applying visibility rules based on the viewer's authentication and connection status.
 *
 * - Unauthenticated viewers: only see publicly listed profiles with visible traits.
 * - Authenticated but unconnected viewers: only see publicly listed profiles with visible traits.
 * - Connected viewers: see visible traits plus traits shared via connection groups.
 *
 * @param username - The username to search for (exact, case-sensitive match).
 * @returns The user with their filtered traits, or `null` if not found or not visible.
 */
async function findUserWithTraitsByUsername(username: string) {
  const viewerId = await getAuthedAccountId();

  const user = await prisma.user.findFirst({
    where: {
      username: { contains: username, mode: "default" },
    },
  });

  if (!user) return null;

  if (!viewerId) {
    if (!user.publicListed) return null;
    const traits = await prisma.trait.findMany({
      where: { accountId: user.id, isVisible: true },
    });
    return { ...user, traits };
  }

  const isConnected = !!(await prisma.connection.findFirst({
    where: {
      OR: [
        { initiatorId: viewerId, recipientId: user.id },
        { initiatorId: user.id, recipientId: viewerId },
      ],
      status: "ACCEPTED",
    },
  }));

  if (!isConnected) {
    if (!user.publicListed) return null;
  }

  const traits = await prisma.trait.findMany({
    where: {
      accountId: user.id,
      ...(isConnected
        ? {
            OR: [
              { isVisible: true },
              {
                visibleGroups: {
                  some: {
                    sides: {
                      some: {
                        accountId: viewerId,
                      },
                    },
                  },
                },
              },
            ],
          }
        : { isVisible: true }),
    },
  });

  return { ...user, traits };
}

/**
 * Searches for publicly listed users whose username contains the given string.
 *
 * @param username - The username substring to search for (case-sensitive).
 * @returns An array of matching publicly listed users.
 */
function findUsersByUsername(username: string) {
  return prisma.user.findMany({
    where: {
      publicListed: true,
      username: {
        contains: username,
        mode: "default",
      },
    },
  });
}

/**
 * Updates the authenticated user's profile fields.
 *
 * Requires authentication and verifies the user exists before updating.
 *
 * @param data - The fields to update (displayName, username, publicListed).
 * @returns The updated user record.
 * @throws {AuthenticationError} If not authenticated or the user record is not found.
 */
async function updateUser(data: {
  displayName?: string;
  username?: string;
  publicListed?: boolean;
}) {
  const accountId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: accountId } });

  if (!user) throw new AuthenticationError("User not found");

  return prisma.user.update({ where: { id: accountId }, data });
}

/**
 * Retrieves all traits belonging to the authenticated user (owner view).
 *
 * @returns An array of the authenticated user's traits.
 * @throws {AuthenticationError} If not authenticated.
 */
async function findUserTraitsForOwner() {
  const accountId = await requireAuth();
  return prisma.trait.findMany({ where: { accountId } });
}

/**
 * Retrieves traits of another user that are visible to the authenticated viewer
 * through shared connection groups.
 *
 * @param userId - The ID of the user whose traits to retrieve.
 * @returns An array of traits visible to the viewer via connection groups.
 * @throws {AuthenticationError} If not authenticated.
 */
async function findUserTraitsForViewer(userId: string) {
  const viewerUserId = await requireAuth();

  return prisma.trait.findMany({
    where: {
      visibleGroups: {
        some: {
          accountId: viewerUserId,
          AND: {
            sides: {
              some: {
                accountId: userId,
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Retrieves all connections (initiated or received) for the authenticated user.
 *
 * @returns An array of the authenticated user's connections.
 * @throws {AuthenticationError} If not authenticated.
 */
async function findUserConnections() {
  const accountId = await requireAuth();
  return prisma.connection.findMany({
    where: {
      OR: [{ initiatorId: accountId }, { recipientId: accountId }],
    },
  });
}

/**
 * Retrieves all connection groups belonging to a given user.
 *
 * @param userId - The ID of the user whose connection groups to retrieve.
 * @returns An array of the user's connection groups.
 */
function findUserConnectionGroups(userId: string) {
  return prisma.connectionGroup.findMany({ where: { accountId: userId } });
}

export const user = { findUserById, updateUser };
export const search = {
  findUsersByUsername,
  findUserWithTraitsByUsername,
  findUserTraitsForOwner,
  findUserTraitsForViewer,
  findUserConnections,
  findUserConnectionGroups,
};

const service = { user, search };
export default service;
