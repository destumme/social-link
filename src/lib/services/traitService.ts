import { TraitCategory } from "@/generated/prisma/enums";
import { prisma } from "@/lib/database/prisma";

function findTraitsByAccountId(accountId: string) {
  return prisma.trait.findMany({ where: { accountId } });
}

function findTraitById(id: string) {
  return prisma.trait.findUnique({ where: { id } });
}

function createTrait(
  data: { key: string; value: string; category: TraitCategory; icon?: string },
  accountId: string,
) {
  return prisma.trait.create({
    data: {
      ...data,
      accountId,
    },
  });
}

function updateTrait(
  id: string,
  data: {
    key?: string;
    value?: string;
    category?: TraitCategory;
    icon?: string;
  },
) {
  return prisma.trait.update({ where: { id }, data });
}

function deleteTrait(id: string) {
  return prisma.trait.delete({ where: { id } });
}

function findVisibleGroupsForTrait(traitId: string) {
  return prisma.connectionGroup.findMany({
    where: { traits: { some: { id: traitId } } },
  });
}

function findAccountForTrait(accountId: string) {
  return prisma.account.findUnique({ where: { id: accountId } });
}

export const trait = { findTraitById, createTrait, updateTrait, deleteTrait };
export const search = {
  findTraitsByAccountId,
  findVisibleGroupsForTrait,
  findAccountForTrait,
};

const service = { trait, search };
export default service;
