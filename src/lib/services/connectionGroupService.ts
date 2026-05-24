import { prisma } from "@/lib/database/prisma";

export function findConnectionGroupsByAccountId(accountId: string) {
  return prisma.connectionGroup.findMany({ where: { accountId } });
}

export function findConnectionGroupById(id: string) {
  return prisma.connectionGroup.findUnique({ where: { id } });
}

export function createConnectionGroup(
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

export function updateConnectionGroup(
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

export function deleteConnectionGroup(id: string) {
  return prisma.connectionGroup.delete({ where: { id } });
}

export function addTraitToGroup(groupId: string, traitId: string) {
  return prisma.connectionGroup.update({
    where: { id: groupId },
    data: { traits: { connect: { id: traitId } } },
  });
}

export function removeTraitFromGroup(groupId: string, traitId: string) {
  return prisma.connectionGroup.update({
    where: { id: groupId },
    data: { traits: { disconnect: [{ id: traitId }] } },
    include: { traits: true },
  });
}

export function findAccountForGroup(accountId: string) {
  return prisma.account.findUnique({ where: { id: accountId } });
}

export function findConnectionsForGroup(groupId: string) {
  return prisma.connection.findMany({
    where: { connectionGroups: { some: { id: groupId } } },
  });
}

export function findTraitsForGroup(groupId: string) {
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
