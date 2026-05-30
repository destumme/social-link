import { prisma } from "@/lib/database/prisma";

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

function updateUser(
  userId: string,
  data: { displayName?: string; username?: string; publicListed?: boolean },
) {
  return prisma.user.update({ where: { id: userId }, data });
}

function findUserTraitsForOwner(userId: string) {
  return prisma.trait.findMany({ where: { accountId: userId } });
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

function findUserConnections(userId: string) {
  return prisma.connection.findMany({ where: { accountId: userId } });
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
