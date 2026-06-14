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
  findUserTraitsForOwner,
  findUserTraitsForViewer,
  findUserConnections,
  findUserConnectionGroups,
};

const service = { user, search };
export default service;
