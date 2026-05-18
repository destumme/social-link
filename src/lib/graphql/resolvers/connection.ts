import { GraphqlContext } from "./context";

interface RequestConnectionInput {
  groupIds?: string[];
  sharedTraitIds?: string[];
}

export const Connection = {
  account: (parent: { accountId: string }) => {
    throw new Error("Not implemented");
  },
  connectedAccount: (parent: { connectedAccountId: string }) => {
    throw new Error("Not implemented");
  },
  groups: (parent: { groups: string[] }) => {
    throw new Error("Not implemented");
  },
  traits: (parent: { traits: string[] }) => {
    throw new Error("Not implemented");
  },
};

export const Query = {
  myConnections: (
    _parent: unknown,
    _args: unknown,
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  pendingConnections: (
    _parent: unknown,
    _args: unknown,
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  connectionByAccount: (_parent: unknown, _args: { accountId: string }) => {
    throw new Error("Not implemented");
  },
};

export const Mutation = {
  requestConnection: (
    _parent: unknown,
    _args: { accountId: string; input: RequestConnectionInput },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  acceptConnection: (
    _parent: unknown,
    _args: { connectionId: string },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  declineConnection: (
    _parent: unknown,
    _args: { connectionId: string },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  removeConnection: (
    _parent: unknown,
    _args: { id: string },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  addConnectionToGroup: (
    _parent: unknown,
    _args: { connectionId: string; groupId: string },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  removeConnectionFromGroup: (
    _parent: unknown,
    _args: { connectionId: string; groupId: string },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
  updateConnectionTraits: (
    _parent: unknown,
    _args: { connectionId: string; traitIds: string[] },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
};
