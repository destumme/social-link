import { TraitCategory } from "@/generated/prisma/enums";
import { prisma } from "@/lib/database/prisma";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./errors";

function findTraitsByAccountId(accountId: string) {
  if (!accountId) throw new AuthenticationError("Not authenticated");
  return prisma.trait.findMany({ where: { accountId } });
}

function findTraitById(id: string) {
  return prisma.trait.findUnique({ where: { id } });
}

function createTrait(
  data: { key: string; value: string; category: TraitCategory; icon?: string },
  accountId: string,
) {
  if (!accountId) throw new AuthenticationError("Not authenticated");
  return prisma.trait.create({
    data: {
      ...data,
      accountId,
    },
  });
}

async function updateTrait(
  authedUserId: string,
  id: string,
  data: {
    key?: string;
    value?: string;
    category?: TraitCategory;
    icon?: string;
  },
) {
  if (!authedUserId) throw new AuthenticationError("Not authenticated");
  const trait = await prisma.trait.findUnique({ where: { id } });
  if (!trait) throw new NotFoundError("Trait not found");
  if (trait.accountId !== authedUserId)
    throw new AuthorizationError("Not authorized");
  return prisma.trait.update({ where: { id }, data });
}

async function deleteTrait(authedUserId: string, id: string) {
  if (!authedUserId) throw new AuthenticationError("Not authenticated");
  const trait = await prisma.trait.findUnique({ where: { id } });
  if (!trait) throw new NotFoundError("Trait not found");
  if (trait.accountId !== authedUserId)
    throw new AuthorizationError("Not authorized");
  return prisma.trait.delete({ where: { id } });
}

function findVisibleGroupsForTrait(traitId: string) {
  return prisma.connectionGroup.findMany({
    where: { traits: { some: { id: traitId } } },
  });
}

function findAccountForTrait(accountId: string) {
  return prisma.user.findUnique({ where: { id: accountId } });
}

export const trait = { findTraitById, createTrait, updateTrait, deleteTrait };
export const search = {
  findTraitsByAccountId,
  findVisibleGroupsForTrait,
  findAccountForTrait,
};

const service = { trait, search };
export default service;
