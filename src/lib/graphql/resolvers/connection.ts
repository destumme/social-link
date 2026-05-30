import { GraphQLContext } from "./context";
import { GraphQLAppError, NotFoundError, UnauthorizedError } from "../errors";
import connectionService from "@/lib/services/connectionService";

interface RequestConnectionInput {
  groupIds?: string[];
  sharedTraitIds?: string[];
}

export const Connection = {
  account: (parent: { accountId: string }) => {
    return connectionService.search.findAccountForConnection(parent.accountId);
  },
  connectedAccount: (parent: { connectedAccountId: string }) => {
    return connectionService.search.findConnectedAccountForConnection(
      parent.connectedAccountId,
    );
  },
  groups: (parent: { id: string }) => {
    return connectionService.search.findGroupsForConnection(parent.id);
  },
};

export const Query = {
  myConnections: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    if (!context.authedAccountId) {
      throw new UnauthorizedError("Not authenticated");
    }
    return connectionService.search.findConnectionsByAccountId(
      context.authedAccountId,
      "ACCEPTED",
    );
  },
  pendingConnections: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    if (!context.authedAccountId) {
      throw new UnauthorizedError("Not authenticated");
    }
    return connectionService.search.findPendingConnectionsForAccount(
      context.authedAccountId,
    );
  },
  connectionByAccount: (
    _parent: unknown,
    args: { accountId: string },
    context: GraphQLContext,
  ) => {
    if (!context.authedAccountId) {
      throw new UnauthorizedError("Not authenticated");
    }
    return connectionService.search.findConnectionBetweenAccounts(
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
    if (!context.authedAccountId) {
      throw new UnauthorizedError("Not authenticated");
    }
    const existing = await connectionService.search.checkConnectionExists(
      context.authedAccountId,
      args.accountId,
    );
    if (existing) {
      throw new GraphQLAppError("Connection already exists", {
        code: "CONFLICT",
        statusCode: 409,
      });
    }
    return connectionService.connectionPair.createConnectionPair(
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
    const pair = await connectionService.connectionPair.findConnectionPair(
      args.connectionId,
    );
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
    return connectionService.connectionPair.acceptConnectionPair(
      pair.connection.id,
      pair.otherSide.id,
    );
  },
  declineConnection: async (
    _parent: unknown,
    args: { connectionId: string },
    _context: GraphQLContext,
  ) => {
    const pair = await connectionService.connectionPair.findConnectionPair(
      args.connectionId,
    );
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
    return connectionService.connectionPair.declineConnectionPair(
      pair.connection.id,
      pair.otherSide.id,
    );
  },
  removeConnection: async (
    _parent: unknown,
    args: { id: string },
    _context: GraphQLContext,
  ) => {
    const connection = await connectionService.connection.findConnectionById(
      args.id,
    );
    if (!connection) throw new NotFoundError("Connection not found");
    await connectionService.connectionPair.deleteConnectionPair(
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
    const connection = await connectionService.connection.findConnectionById(
      args.connectionId,
    );
    if (!connection) throw new NotFoundError("Connection not found");
    if (connection.status !== "ACCEPTED") {
      throw new GraphQLAppError(
        "Only accepted connections can be added to groups",
        { code: "BAD_REQUEST", statusCode: 400 },
      );
    }
    return connectionService.connection.addConnectionToGroup(
      args.connectionId,
      args.groupId,
    );
  },
  removeConnectionFromGroup: async (
    _parent: unknown,
    args: { connectionId: string; groupId: string },
    _context: GraphQLContext,
  ) => {
    return connectionService.connection.removeConnectionFromGroup(
      args.connectionId,
      args.groupId,
    );
  },
  updateConnectionTraits: async (
    _parent: unknown,
    args: { connectionId: string; traitIds: string[] },
    _context: GraphQLContext,
  ) => {
    return connectionService.connection.updateConnectionTraitGroups(
      args.connectionId,
      args.traitIds,
    );
  },
};
