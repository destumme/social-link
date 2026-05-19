import { prisma } from "@/lib/database/prisma";
import { GraphQLContext } from "./context";

interface CreateTraitInput {
  key: string;
  value: string;
  category: string;
  icon?: string;
}

interface UpdateTraitInput {
  key?: string;
  value?: string;
  category?: string;
  icon?: string;
}

export const Trait = {
  account: (parent: { accountId: string }) => {
    return prisma.account.findUnique({ where: { id: parent.accountId } });
  },
  visibleGroups: (parent: { id: string }) => {
    return prisma.connectionGroup.findMany({
      where: { traits: { some: { id: parent.id } } },
    });
  },
};

export const Query = {
  myTraits: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
    return prisma.trait.findMany({
      where: { accountId: context.authedAccountId },
    });
  },
  traitById: (_parent: unknown, args: { id: string }) => {
    return prisma.trait.findUnique({ where: { id: args.id } });
  },
};

export const Mutation = {
  createTrait: (
    _parent: unknown,
    args: { input: CreateTraitInput },
    context: GraphQLContext,
  ) => {
    return prisma.trait.create({
      data: {
        key: args.input.key,
        value: args.input.value,
        category: args.input.category,
        icon: args.input.icon,
        accountId: context.authedAccountId,
      },
    });
  },
  updateTrait: (
    _parent: unknown,
    args: { id: string; input: UpdateTraitInput },
    _context: GraphQLContext,
  ) => {
    return prisma.trait.update({
      where: { id: args.id },
      data: args.input,
    });
  },
  deleteTrait: (
    _parent: unknown,
    args: { id: string },
    _context: GraphQLContext,
  ) => {
    await prisma.trait.delete({ where: { id: args.id } });
    return true;
  },
};
