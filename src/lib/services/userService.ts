import { prisma } from "@/lib/database/prisma";
import { getAuthedAccountId } from "@/lib/auth-server";
import { AuthenticationError } from "./errors";

async function requireAuth() {
  const accountId = await getAuthedAccountId();
  if (!accountId) throw new AuthenticationError("Not authenticated");
  return accountId;
}

function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

async function findUserWithTraitsByUsername(username: string) {
  const viewerId = await getAuthedAccountId();

  const user = await prisma.user.findFirst({
    where: {
      username: { contains: username, mode: "default" },
    },
  });

  if (!user) return null;

  const isConnected = viewerId
    ? !!(await prisma.connection.findFirst({
        where: {
          accountId: viewerId,
          connectedAccountId: user.id,
          status: "ACCEPTED",
        },
      }))
    : false;

  if (!viewerId || !isConnected) {
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
                    connections: {
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

async function findUserTraitsForOwner() {
  const accountId = await requireAuth();
  return prisma.trait.findMany({ where: { accountId } });
}

async function findUserTraitsForViewer(userId: string) {
  const viewerUserId = await requireAuth();
  return prisma.trait.findMany({
    where: {
      visibleGroups: {
        some: {
          accountId: viewerUserId,
          AND: {
            connections: {
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

async function findUserConnections() {
  const accountId = await requireAuth();
  return prisma.connection.findMany({ where: { accountId } });
}

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
