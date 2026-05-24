import { GraphQLContext } from "./context";
import { GraphQLAppError, NotFoundError } from "../errors";
import {
  findConnectionsByAccountId,
  findPendingConnectionsForAccount,
  findConnectionBetweenAccounts,
  findConnectionById,
  findConnectionPair,
  checkConnectionExists,
  createConnectionPair,
  acceptConnectionPair,
  declineConnectionPair,
  deleteConnectionPair,
  addConnectionToGroup,
  removeConnectionFromGroup,
  updateConnectionTraitGroups,
  findGroupsForConnection,
  findAccountForConnection,
  findConnectedAccountForConnection,
} from "@/lib/services/connectionService";

interface RequestConnectionInput {
  groupIds?: string[];
  sharedTraitIds?: string[];
}

export const Connection = {
  account: (parent: { accountId: string }) => {
    return findAccountForConnection(parent.accountId);
  },
  connectedAccount: (parent: { connectedAccountId: string }) => {
    return findConnectedAccountForConnection(parent.connectedAccountId);
  },
  groups: (parent: { id: string }) => {
    return findGroupsForConnection(parent.id);
  },
};

export const Query = {
  myConnections: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return findConnectionsByAccountId(context.authedAccountId, "ACCEPTED");
  },
  pendingConnections: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return findPendingConnectionsForAccount(context.authedAccountId);
  },
  connectionByAccount: (
    _parent: unknown,
    args: { accountId: string },
    context: GraphQLContext,
  ) => {
    return findConnectionBetweenAccounts(
      context.authedAccountId,
      args.accountId,
    );
  },
};

export const Mutation = {
  requestConnection: async (
    _parent: unknown,
    args: { accountId: string; input: RequestConnectionInput },
    context: GraphQLContext,
  ) => {
    //agent-done: verify no existing connection in either direction before creating
    const existing = await checkConnectionExists(
      context.authedAccountId,
      args.accountId,
    );
    if (existing) {
      throw new GraphQLAppError("Connection already exists", {
        code: "CONFLICT",
        statusCode: 409,
      });
    }
    return createConnectionPair(
      context.authedAccountId,
      args.accountId,
      args.input.groupIds,
    );
  },
  acceptConnection: async (
    _parent: unknown,
    args: { connectionId: string },
    _context: GraphQLContext,
  ) => {
    //agent-done: verify both sides are PENDING, then update both to ACCEPTED in a transaction
    const pair = await findConnectionPair(args.connectionId);
    if (!pair || !pair.connection)
      throw new NotFoundError("Connection not found");
    if (
      !pair.otherSide ||
      pair.connection.status !== "PENDING" ||
      pair.otherSide.status !== "PENDING"
    ) {
      throw new GraphQLAppError("Connection must be PENDING on both sides", {
        code: "BAD_REQUEST",
        statusCode: 400,
      });
    }
    return acceptConnectionPair(pair.connection.id, pair.otherSide.id);
  },
  declineConnection: async (
    _parent: unknown,
    args: { connectionId: string },
    _context: GraphQLContext,
  ) => {
    //agent-done: verify both sides are PENDING, then update both to DECLINED in a transaction
    const pair = await findConnectionPair(args.connectionId);
    if (!pair || !pair.connection)
      throw new NotFoundError("Connection not found");
    if (
      !pair.otherSide ||
      pair.connection.status !== "PENDING" ||
      pair.otherSide.status !== "PENDING"
    ) {
      throw new GraphQLAppError("Connection must be PENDING on both sides", {
        code: "BAD_REQUEST",
        statusCode: 400,
      });
    }
    return declineConnectionPair(pair.connection.id, pair.otherSide.id);
  },
  removeConnection: async (
    _parent: unknown,
    args: { id: string },
    _context: GraphQLContext,
  ) => {
    //agent-done: delete both sides in a transaction; Prisma auto-cleans connectionGroups join records
    const connection = await findConnectionById(args.id);
    if (!connection) throw new NotFoundError("Connection not found");
    await deleteConnectionPair(
      connection.id,
      connection.connectedAccountId ?? "",
      connection.accountId ?? "",
    );
    return true;
  },
  addConnectionToGroup: async (
    _parent: unknown,
    args: { connectionId: string; groupId: string },
    _context: GraphQLContext,
  ) => {
    //agent-done: verify connection is ACCEPTED before adding to group
    const connection = await findConnectionById(args.connectionId);
    if (!connection) throw new NotFoundError("Connection not found");
    if (connection.status !== "ACCEPTED") {
      throw new GraphQLAppError(
        "Only accepted connections can be added to groups",
        { code: "BAD_REQUEST", statusCode: 400 },
      );
    }
    return addConnectionToGroup(args.connectionId, args.groupId);
  },
  removeConnectionFromGroup: async (
    _parent: unknown,
    args: { connectionId: string; groupId: string },
    _context: GraphQLContext,
  ) => {
    return removeConnectionFromGroup(args.connectionId, args.groupId);
  },
  updateConnectionTraits: async (
    _parent: unknown,
    args: { connectionId: string; traitIds: string[] },
    _context: GraphQLContext,
  ) => {
    //agent-todo:
    // update this function to do a full replacement of the related traits to a group when this is called
    return updateConnectionTraitGroups(args.connectionId, args.traitIds);
  },
};
