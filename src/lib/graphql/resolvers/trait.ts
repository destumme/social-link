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
    return traitService.search.findTraitsByAccountId(context.authedUserId!);
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
    return traitService.trait.createTrait(args.input, context.authedUserId!);
  },
  updateTrait: (
    _parent: unknown,
    args: { id: string; input: UpdateTraitInput },
    context: GraphQLContext,
  ) => {
    return traitService.trait.updateTrait(
      context.authedUserId!,
      args.id,
      args.input,
    );
  },
  deleteTrait: async (
    _parent: unknown,
    args: { id: string },
    context: GraphQLContext,
  ) => {
    await traitService.trait.deleteTrait(context.authedUserId!, args.id);
    return true;
  },
};
