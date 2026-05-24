import { TraitCategory } from "@/generated/prisma/enums";
import { prisma } from "@/lib/database/prisma";

export function findTraitsByAccountId(accountId: string) {
  return prisma.trait.findMany({ where: { accountId } });
}

export function findTraitById(id: string) {
  return prisma.trait.findUnique({ where: { id } });
}

export function createTrait(
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

export function updateTrait(
  id: string,
  data: { key?: string; value?: string; category?: TraitCategory; icon?: string },
) {
  return prisma.trait.update({ where: { id }, data });
}

export function deleteTrait(id: string) {
  return prisma.trait.delete({ where: { id } });
}

export function findVisibleGroupsForTrait(traitId: string) {
  return prisma.connectionGroup.findMany({
    where: { traits: { some: { id: traitId } } },
  });
}

export function findAccountForTrait(accountId: string) {
  return prisma.account.findUnique({ where: { id: accountId } });
}
