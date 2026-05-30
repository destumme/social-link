import { GraphQLContext } from "./context";
import connectionGroupService from "@/lib/services/connectionGroupService";

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
    return connectionGroupService.search.findAccountForGroup(parent.accountId);
  },
  connections: (parent: { id: string }) => {
    return connectionGroupService.search.findConnectionsForGroup(parent.id);
  },
  traits: (parent: { id: string }) => {
    return connectionGroupService.search.findTraitsForGroup(parent.id);
  },
};

export const Query = {
  myConnectionGroups: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return connectionGroupService.search.findConnectionGroupsByAccountId(
      context.authedUserId!,
    );
  },
};

export const Mutation = {
  createConnectionGroup: async (
    _parent: unknown,
    args: { input: CreateConnectionGroupInput },
    context: GraphQLContext,
  ) => {
    return connectionGroupService.connectionGroup.createConnectionGroup(
      args.input.name,
      context.authedUserId!,
      args.input.traitIds,
    );
  },
  updateConnectionGroup: async (
    _parent: unknown,
    args: { id: string; input: UpdateConnectionGroupInput },
    context: GraphQLContext,
  ) => {
    return connectionGroupService.connectionGroup.updateConnectionGroup(
      context.authedUserId!,
      args.id,
      args.input,
    );
  },
  deleteConnectionGroup: async (
    _parent: unknown,
    args: { id: string },
    context: GraphQLContext,
  ) => {
    await connectionGroupService.connectionGroup.deleteConnectionGroup(
      context.authedUserId!,
      args.id,
    );
    return true;
  },
  addTraitToGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
    context: GraphQLContext,
  ) => {
    return connectionGroupService.connectionGroup.addTraitToGroup(
      context.authedUserId!,
      args.groupId,
      args.traitId,
    );
  },
  removeTraitFromGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
    context: GraphQLContext,
  ) => {
    return connectionGroupService.connectionGroup.removeTraitFromGroup(
      context.authedUserId!,
      args.groupId,
      args.traitId,
    );
  },
};
