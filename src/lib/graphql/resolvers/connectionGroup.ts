import { GraphqlContext } from "./context";

interface CreateConnectionGroupInput {
  name: string;
  traitIds?: string[];
}

interface UpdateConnectionGroupInput {
  name?: string;
  traitIds?: string[];
}

export const ConnectionGroup = {
  account: (parent: { accountId: string }) => {
    throw new Error("Not implemented");
  },
  connections: (parent: { connections: string[] }) => {
    throw new Error("Not implemented");
  },
  traits: (parent: { traits: string[] }) => {
    throw new Error("Not implemented");
  },
};

export const Query = {
  myConnectionGroups: (
    _parent: unknown,
    _args: unknown,
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
};

export const Mutation = {
  createConnectionGroup: (
    _parent: unknown,
    _args: { input: CreateConnectionGroupInput },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  updateConnectionGroup: (
    _parent: unknown,
    _args: { id: string; input: UpdateConnectionGroupInput },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  deleteConnectionGroup: (
    _parent: unknown,
    _args: { id: string },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  addTraitToGroup: (
    _parent: unknown,
    _args: { groupId: string; traitId: string },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  removeTraitFromGroup: (
    _parent: unknown,
    _args: { groupId: string; traitId: string },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
};
