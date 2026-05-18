import { GraphqlContext } from "./context";

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
    throw new Error("Not implemented");
  },
  visibleGroups: (parent: { visibleGroups: string[] }) => {
    throw new Error("Not implemented");
  },
};

export const Query = {
  myTraits: (_parent: unknown, _args: unknown, _context: GraphqlContext) => {
    throw new Error("Not implemented");
  },
  traitById: (_parent: unknown, _args: { id: string }) => {
    throw new Error("Not implemented");
  },
};

export const Mutation = {
  createTrait: (
    _parent: unknown,
    _args: { input: CreateTraitInput },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  updateTrait: (
    _parent: unknown,
    _args: { id: string; input: UpdateTraitInput },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  deleteTrait: (
    _parent: unknown,
    _args: { id: string },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
};
