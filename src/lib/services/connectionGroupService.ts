import { prisma } from "@/lib/database/prisma";
import { getAuthedAccountId } from "@/lib/auth-server";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./errors";

async function requireAuth() {
  const accountId = await getAuthedAccountId();
  if (!accountId) throw new AuthenticationError("Not authenticated");
  return accountId;
}

async function findConnectionGroupsByAccountId() {
  const accountId = await requireAuth();
  return prisma.connectionGroup.findMany({ where: { accountId } });
}

function findConnectionGroupById(id: string) {
  return prisma.connectionGroup.findUnique({ where: { id } });
}

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

async function updateConnectionGroup(
  id: string,
  data: { name?: string; traitIds?: string[] },
) {
  const accountId = await requireAuth();
  const group = await prisma.connectionGroup.findUnique({ where: { id } });
  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");
  const { traitIds, ...rest } = data;
  const updateData: Record<string, unknown> = { ...rest };
  if (traitIds !== undefined) {
    updateData.traits = { set: traitIds.map((t) => ({ id: t })) };
  }
  return prisma.connectionGroup.update({ where: { id }, data: updateData });
}

async function deleteConnectionGroup(id: string) {
  const accountId = await requireAuth();
  const group = await prisma.connectionGroup.findUnique({ where: { id } });
  if (!group) throw new NotFoundError("Connection group not found");
  if (group.accountId !== accountId)
    throw new AuthorizationError("Not authorized");
  return prisma.connectionGroup.delete({ where: { id } });
}

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
