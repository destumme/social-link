import { prisma } from "@/lib/database/prisma";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./errors";

function findConnectionGroupsByAccountId(accountId: string) {
  if (!accountId) throw new AuthenticationError("Not authenticated");
  return prisma.connectionGroup.findMany({ where: { accountId } });
}

function findConnectionGroupById(id: string) {
  return prisma.connectionGroup.findUnique({ where: { id } });
}

async function createConnectionGroup(
  name: string,
  accountId: string,
  traitIds?: string[],
) {
  if (!accountId) throw new AuthenticationError("Not authenticated");
  const traits = traitIds !== undefined ? traitIds.map((t) => ({ id: t })) : [];
  return prisma.connectionGroup.create({
    data: {
      name,
      accountId,
      ...(traits.length !== 0 ? { traits: { connect: traits } } : {}),
    },
  });
}

async function updateConnectionGroup(
  authedUserId: string,
  id: string,
  data: { name?: string; traitIds?: string[] },
) {
  if (!authedUserId) throw new AuthenticationError("Not authenticated");
  const group = await prisma.connectionGroup.findUnique({ where: { id } });
  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== authedUserId)
    throw new AuthorizationError("Not authorized");
  const { traitIds, ...rest } = data;
  const updateData: Record<string, unknown> = { ...rest };
  if (traitIds !== undefined) {
    updateData.traits = { set: traitIds.map((t) => ({ id: t })) };
  }
  return prisma.connectionGroup.update({ where: { id }, data: updateData });
}

async function deleteConnectionGroup(authedUserId: string, id: string) {
  if (!authedUserId) throw new AuthenticationError("Not authenticated");
  const group = await prisma.connectionGroup.findUnique({ where: { id } });
  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== authedUserId)
    throw new AuthorizationError("Not authorized");
  return prisma.connectionGroup.delete({ where: { id } });
}

async function addTraitToGroup(
  authedUserId: string,
  groupId: string,
  traitId: string,
) {
  if (!authedUserId) throw new AuthenticationError("Not authenticated");
  const group = await prisma.connectionGroup.findUnique({
    where: { id: groupId },
  });
  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== authedUserId)
    throw new AuthorizationError("Not authorized");
  return prisma.connectionGroup.update({
    where: { id: groupId },
    data: { traits: { connect: { id: traitId } } },
  });
}

async function removeTraitFromGroup(
  authedUserId: string,
  groupId: string,
  traitId: string,
) {
  if (!authedUserId) throw new AuthenticationError("Not authenticated");
  const group = await prisma.connectionGroup.findUnique({
    where: { id: groupId },
  });
  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== authedUserId)
    throw new AuthorizationError("Not authorized");
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
