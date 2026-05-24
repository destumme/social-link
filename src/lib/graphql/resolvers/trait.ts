import { GraphQLContext } from "./context";
import {
  findTraitsByAccountId,
  findTraitById,
  createTrait,
  updateTrait,
  deleteTrait,
  findVisibleGroupsForTrait,
  findAccountForTrait,
} from "@/lib/services/traitService";

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
    return findAccountForTrait(parent.accountId);
  },
  visibleGroups: (parent: { id: string }) => {
    return findVisibleGroupsForTrait(parent.id);
  },
};

export const Query = {
  myTraits: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
    return findTraitsByAccountId(context.authedAccountId);
  },
  traitById: (_parent: unknown, args: { id: string }) => {
    return findTraitById(args.id);
  },
};

export const Mutation = {
  createTrait: (
    _parent: unknown,
    args: { input: CreateTraitInput },
    context: GraphQLContext,
  ) => {
    return createTrait(args.input, context.authedAccountId);
  },
  updateTrait: (
    _parent: unknown,
    args: { id: string; input: UpdateTraitInput },
    _context: GraphQLContext,
  ) => {
    return updateTrait(args.id, args.input);
  },
  deleteTrait: async (
    _parent: unknown,
    args: { id: string },
    _context: GraphQLContext,
  ) => {
    await deleteTrait(args.id);
    return true;
  },
};
