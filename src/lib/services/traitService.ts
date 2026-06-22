import { TraitCategory } from "@/generated/prisma/enums";
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

async function findTraitsByAccountId() {
  const accountId = await requireAuth();
  return prisma.trait.findMany({ where: { accountId } });
}

function findTraitById(id: string) {
  return prisma.trait.findUnique({ where: { id } });
}

async function createTrait(data: {
  key: string;
  value: string;
  category: TraitCategory;
  icon?: string;
}) {
  const accountId = await requireAuth();
  return prisma.trait.create({
    data: {
      ...data,
      accountId,
    },
  });
}

async function updateTrait(
  id: string,
  data: {
    key?: string;
    value?: string;
    category?: TraitCategory;
    icon?: string;
    isVisible?: boolean;
  },
) {
  const accountId = await requireAuth();
  const trait = await prisma.trait.findUnique({ where: { id } });
  if (!trait) throw new NotFoundError("Trait not found");
  if (trait.accountId !== accountId)
    throw new AuthorizationError("Not authorized");

  if (data.isVisible === true) {
    const user = await prisma.user.findUnique({ where: { id: accountId } });
    console.log(user);
    if (!user || !user.publicListed) {
      throw new AuthorizationError(
        "Cannot make trait visible when profile is not public",
      );
    }
  }

  return prisma.trait.update({ where: { id }, data });
}

async function deleteTrait(id: string) {
  const accountId = await requireAuth();
  const trait = await prisma.trait.findUnique({ where: { id } });
  if (!trait) throw new NotFoundError("Trait not found");
  if (trait.accountId !== accountId)
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
