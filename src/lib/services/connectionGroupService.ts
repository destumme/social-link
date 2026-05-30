import { prisma } from "@/lib/database/prisma";

function findConnectionGroupsByAccountId(accountId: string) {
  return prisma.connectionGroup.findMany({ where: { accountId } });
}

function findConnectionGroupById(id: string) {
  return prisma.connectionGroup.findUnique({ where: { id } });
}

function createConnectionGroup(
  name: string,
  accountId: string,
  traitIds?: string[],
) {
  const traits = traitIds !== undefined ? traitIds.map((t) => ({ id: t })) : [];
  return prisma.connectionGroup.create({
    data: {
      name,
      accountId,
      ...(traits.length !== 0 ? { traits: { connect: traits } } : {}),
    },
  });
}

function updateConnectionGroup(
  id: string,
  data: { name?: string; traitIds?: string[] },
) {
  const { traitIds, ...rest } = data;
  const updateData: Record<string, unknown> = { ...rest };
  if (traitIds !== undefined) {
    updateData.traits = { set: traitIds.map((t) => ({ id: t })) };
  }
  return prisma.connectionGroup.update({ where: { id }, data: updateData });
}

function deleteConnectionGroup(id: string) {
  return prisma.connectionGroup.delete({ where: { id } });
}

function addTraitToGroup(groupId: string, traitId: string) {
  return prisma.connectionGroup.update({
    where: { id: groupId },
    data: { traits: { connect: { id: traitId } } },
  });
}

function removeTraitFromGroup(groupId: string, traitId: string) {
  return prisma.connectionGroup.update({
    where: { id: groupId },
    data: { traits: { disconnect: [{ id: traitId }] } },
    include: { traits: true },
  });
}

function findAccountForGroup(accountId: string) {
  return prisma.user.findUnique({ where: { id: accountId } });
}

function findConnectionsForGroup(groupId: string) {
  return prisma.connection.findMany({
    where: { connectionGroups: { some: { id: groupId } } },
  });
}

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
  findTraitsForGroup,
};

const service = { connectionGroup, search };
export default service;
