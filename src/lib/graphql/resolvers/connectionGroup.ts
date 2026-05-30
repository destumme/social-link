import { NotFoundError, UnauthorizedError } from "../errors";
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
    if (!context.authedAccountId) {
      throw new UnauthorizedError("Not authenticated");
    }
    return connectionGroupService.search.findConnectionGroupsByAccountId(
      context.authedAccountId,
    );
  },
};

export const Mutation = {
  createConnectionGroup: async (
    _parent: unknown,
    args: { input: CreateConnectionGroupInput },
    context: GraphQLContext,
  ) => {
    if (!context.authedAccountId) {
      throw new UnauthorizedError("Not authenticated");
    }
    return connectionGroupService.connectionGroup.createConnectionGroup(
      args.input.name,
      context.authedAccountId,
      args.input.traitIds,
    );
  },
  updateConnectionGroup: async (
    _parent: unknown,
    args: { id: string; input: UpdateConnectionGroupInput },
    _context: GraphQLContext,
  ) => {
    const group =
      await connectionGroupService.connectionGroup.findConnectionGroupById(
        args.id,
      );
    if (group === null) {
      throw new NotFoundError("Connection group not found");
    }
    return connectionGroupService.connectionGroup.updateConnectionGroup(
      args.id,
      args.input,
    );
  },
  deleteConnectionGroup: async (
    _parent: unknown,
    args: { id: string },
    _context: GraphQLContext,
  ) => {
    const group =
      await connectionGroupService.connectionGroup.findConnectionGroupById(
        args.id,
      );
    if (group === null) {
      throw new NotFoundError("Connection group not found");
    }
    await connectionGroupService.connectionGroup.deleteConnectionGroup(args.id);
    return true;
  },
  addTraitToGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
    _context: GraphQLContext,
  ) => {
    const group =
      await connectionGroupService.connectionGroup.findConnectionGroupById(
        args.groupId,
      );
    if (group === null) {
      throw new NotFoundError("Connection group not found");
    }
    return connectionGroupService.connectionGroup.addTraitToGroup(
      args.groupId,
      args.traitId,
    );
  },
  removeTraitFromGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
    _context: GraphQLContext,
  ) => {
    return connectionGroupService.connectionGroup.removeTraitFromGroup(
      args.groupId,
      args.traitId,
    );
  },
};
