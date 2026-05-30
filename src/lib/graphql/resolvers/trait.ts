import { UnauthorizedError } from "../errors";
import { TraitCategory } from "@/generated/prisma/enums";
import { GraphQLContext } from "./context";
import traitService from "@/lib/services/traitService";

interface CreateTraitInput {
  key: string;
  value: string;
  category: TraitCategory;
  icon?: string;
}

interface UpdateTraitInput {
  key?: string;
  value?: string;
  category?: TraitCategory;
  icon?: string;
}

export const Trait = {
  account: (parent: { accountId: string }) => {
    return traitService.search.findAccountForTrait(parent.accountId);
  },
  visibleGroups: (parent: { id: string }) => {
    return traitService.search.findVisibleGroupsForTrait(parent.id);
  },
};

export const Query = {
  myTraits: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
    if (!context.authedAccountId) {
      throw new UnauthorizedError("Not authenticated");
    }
    return traitService.search.findTraitsByAccountId(context.authedAccountId);
  },
  traitById: (_parent: unknown, args: { id: string }) => {
    return traitService.trait.findTraitById(args.id);
  },
};

export const Mutation = {
  createTrait: (
    _parent: unknown,
    args: { input: CreateTraitInput },
    context: GraphQLContext,
  ) => {
    if (!context.authedAccountId) {
      throw new UnauthorizedError("Not authenticated");
    }
    return traitService.trait.createTrait(args.input, context.authedAccountId);
  },
  updateTrait: (
    _parent: unknown,
    args: { id: string; input: UpdateTraitInput },
    _context: GraphQLContext,
  ) => {
    return traitService.trait.updateTrait(args.id, args.input);
  },
  deleteTrait: async (
    _parent: unknown,
    args: { id: string },
    _context: GraphQLContext,
  ) => {
    await traitService.trait.deleteTrait(args.id);
    return true;
  },
};
