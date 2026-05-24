import { NotFoundError } from "../errors";
import { GraphQLContext } from "./context";
import {
  findConnectionGroupsByAccountId,
  findConnectionGroupById,
  createConnectionGroup,
  updateConnectionGroup,
  deleteConnectionGroup,
  addTraitToGroup,
  removeTraitFromGroup,
  findAccountForGroup,
  findConnectionsForGroup,
  findTraitsForGroup,
} from "@/lib/services/connectionGroupService";

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
    return findAccountForGroup(parent.accountId);
  },
  connections: (parent: { id: string }) => {
    return findConnectionsForGroup(parent.id);
  },
  traits: (parent: { id: string }) => {
    return findTraitsForGroup(parent.id);
  },
};

export const Query = {
  myConnectionGroups: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return findConnectionGroupsByAccountId(context.authedAccountId);
  },
};

export const Mutation = {
  createConnectionGroup: async (
    _parent: unknown,
    args: { input: CreateConnectionGroupInput },
    context: GraphQLContext,
  ) => {
    return createConnectionGroup(
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
    const group = await findConnectionGroupById(args.id);
    if (group === null) {
      throw new NotFoundError("Connection group not found");
    }
    return updateConnectionGroup(args.id, args.input);
  },
  deleteConnectionGroup: async (
    _parent: unknown,
    args: { id: string },
    _context: GraphQLContext,
  ) => {
    const group = await findConnectionGroupById(args.id);
    if (group === null) {
      throw new NotFoundError("Connection group not found");
    }
    await deleteConnectionGroup(args.id);
    return true;
  },
  addTraitToGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
    _context: GraphQLContext,
  ) => {
    const group = await findConnectionGroupById(args.groupId);
    if (group === null) {
      throw new NotFoundError("Connection group not found");
    }
    return addTraitToGroup(args.groupId, args.traitId);
  },
  removeTraitFromGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
    _context: GraphQLContext,
  ) => {
    return removeTraitFromGroup(args.groupId, args.traitId);
  },
};
