import { prisma } from "@/lib/database/prisma";
import { AuthenticationError } from "./errors";

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

async function updateUser(
  authedUserId: string,
  data: { displayName?: string; username?: string; publicListed?: boolean },
) {
  if (!authedUserId) throw new AuthenticationError("Not authenticated");
  const user = await prisma.user.findUnique({ where: { id: authedUserId } });
  if (!user) throw new AuthenticationError("User not found");
  return prisma.user.update({ where: { id: authedUserId }, data });
}

function findUserTraitsForOwner(authedUserId: string) {
  if (!authedUserId) throw new AuthenticationError("Not authenticated");
  return prisma.trait.findMany({ where: { accountId: authedUserId } });
}

function findUserTraitsForViewer(userId: string, viewerUserId: string) {
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

function findUserConnections(authedUserId: string) {
  if (!authedUserId) throw new AuthenticationError("Not authenticated");
  return prisma.connection.findMany({ where: { accountId: authedUserId } });
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
