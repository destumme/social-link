import { GraphQLContext } from "./context";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
} from "@/lib/services/errors";
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
    return connectionService.search.findConnectionsByAccountId(
      context.authedUserId!,
      "ACCEPTED",
    );
  },
  pendingConnections: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return connectionService.search.findPendingConnectionsForAccount(
      context.authedUserId!,
    );
  },
  connectionByAccount: (
    _parent: unknown,
    args: { accountId: string },
    context: GraphQLContext,
  ) => {
    return connectionService.search.findConnectionBetweenAccounts(
      context.authedUserId!,
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
    const existing = await connectionService.search.checkConnectionExists(
      context.authedUserId!,
      args.accountId,
    );
    if (existing) {
      throw new ConflictError("Connection already exists");
    }
    return connectionService.connectionPair.createConnectionPair(
      context.authedUserId!,
      args.accountId,
      args.input.groupIds,
    );
  },
  acceptConnection: async (
    _parent: unknown,
    args: { connectionId: string },
    context: GraphQLContext,
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
      throw new BadRequestError("Connection must be PENDING on both sides");
    }
    return connectionService.connectionPair.acceptConnectionPair(
      context.authedUserId!,
      pair.connection.id,
      pair.otherSide!.id,
    );
  },
  declineConnection: async (
    _parent: unknown,
    args: { connectionId: string },
    context: GraphQLContext,
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
      throw new BadRequestError("Connection must be PENDING on both sides");
    }
    return connectionService.connectionPair.declineConnectionPair(
      context.authedUserId!,
      pair.connection.id,
      pair.otherSide!.id,
    );
  },
  removeConnection: async (
    _parent: unknown,
    args: { id: string },
    context: GraphQLContext,
  ) => {
    const connection = await connectionService.connection.findConnectionById(
      args.id,
    );
    if (!connection) throw new NotFoundError("Connection not found");
    await connectionService.connectionPair.deleteConnectionPair(
      context.authedUserId!,
      connection.id,
      connection.connectedAccountId ?? "",
      connection.accountId ?? "",
    );
    return true;
  },
  addConnectionToGroup: async (
    _parent: unknown,
    args: { connectionId: string; groupId: string },
    context: GraphQLContext,
  ) => {
    const connection = await connectionService.connection.findConnectionById(
      args.connectionId,
    );
    if (!connection) throw new NotFoundError("Connection not found");
    if (connection.status !== "ACCEPTED") {
      throw new BadRequestError(
        "Only accepted connections can be added to groups",
      );
    }
    return connectionService.connection.addConnectionToGroup(
      context.authedUserId!,
      args.connectionId,
      args.groupId,
    );
  },
  removeConnectionFromGroup: async (
    _parent: unknown,
    args: { connectionId: string; groupId: string },
    context: GraphQLContext,
  ) => {
    return connectionService.connection.removeConnectionFromGroup(
      context.authedUserId!,
      args.connectionId,
      args.groupId,
    );
  },
  updateConnectionTraits: async (
    _parent: unknown,
    args: { connectionId: string; traitIds: string[] },
    context: GraphQLContext,
  ) => {
    return connectionService.connection.updateConnectionTraitGroups(
      context.authedUserId!,
      args.connectionId,
      args.traitIds,
    );
  },
};
