import type {
  TraitResolvers,
  QueryResolvers,
  MutationResolvers,
} from "@/generated/graphql/server";
import traitService from "@/lib/services/traitService";

export const Trait: TraitResolvers = {
  account: async (parent) => {
    if (!parent.accountId) throw new Error("Trait has no accountId");
    const account = await traitService.search.findAccountForTrait(
      parent.accountId,
    );
    if (!account) throw new Error("Account not found for trait");
    return account;
  },
  visibleGroups: (parent) => {
    return traitService.search.findVisibleGroupsForTrait(parent.id);
  },
};

export const Query: Pick<QueryResolvers, "myTraits" | "traitById"> = {
  myTraits: async () => {
    return traitService.search.findTraitsByAccountId();
  },
  traitById: (_parent, args) => {
    return traitService.trait.findTraitById(args.id);
  },
};

export const Mutation: Pick<
  MutationResolvers,
  "createTrait" | "updateTrait" | "deleteTrait"
> = {
  createTrait: async (_parent, args) => {
    return traitService.trait.createTrait({
      ...args.input,
      icon: args.input.icon ?? undefined,
    });
  },
  updateTrait: async (_parent, args) => {
    const { key, value, category, icon, isVisible } = args.input;
    return traitService.trait.updateTrait(args.id, {
      key: key ?? undefined,
      value: value ?? undefined,
      category: category ?? undefined,
      icon: icon ?? undefined,
      isVisible: isVisible ?? undefined,
    });
  },
  deleteTrait: async (_parent, args) => {
    await traitService.trait.deleteTrait(args.id);
    return true;
  },
};
