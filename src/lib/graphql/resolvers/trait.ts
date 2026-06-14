import { TraitCategory } from "@/generated/prisma/enums";
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
  myTraits: async () => {
    return traitService.search.findTraitsByAccountId();
  },
  traitById: (_parent: unknown, args: { id: string }) => {
    return traitService.trait.findTraitById(args.id);
  },
};

export const Mutation = {
  createTrait: async (_parent: unknown, args: { input: CreateTraitInput }) => {
    return traitService.trait.createTrait(args.input);
  },
  updateTrait: async (
    _parent: unknown,
    args: { id: string; input: UpdateTraitInput },
  ) => {
    return traitService.trait.updateTrait(args.id, args.input);
  },
  deleteTrait: async (_parent: unknown, args: { id: string }) => {
    await traitService.trait.deleteTrait(args.id);
    return true;
  },
};
