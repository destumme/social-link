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
  myConnections: async () => {
    return connectionService.search.findConnectionsByAccountId("ACCEPTED");
  },
  pendingConnections: async () => {
    return connectionService.search.findPendingConnectionsForAccount();
  },
  connectionByAccount: async (
    _parent: unknown,
    args: { accountId: string },
  ) => {
    return connectionService.search.findConnectionBetweenAccounts(
      args.accountId,
    );
  },
};

export const Mutation = {
  requestConnection: async (
    _parent: unknown,
    args: { accountId: string; input: RequestConnectionInput },
  ) => {
    const existing = await connectionService.search.checkConnectionExists(
      args.accountId,
    );
    if (existing) {
      throw new ConflictError("Connection already exists");
    }
    return connectionService.connectionPair.createConnectionPair(
      args.accountId,
      args.input.groupIds,
    );
  },
  acceptConnection: async (
    _parent: unknown,
    args: { connectionId: string },
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
      pair.connection.id,
      pair.otherSide!.id,
    );
  },
  declineConnection: async (
    _parent: unknown,
    args: { connectionId: string },
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
    await connectionService.connectionPair.declineConnectionPair(
      pair.connection.id,
      pair.otherSide!.id,
    );
    return true;
  },
  removeConnection: async (_parent: unknown, args: { id: string }) => {
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
      args.connectionId,
      args.groupId,
    );
  },
  removeConnectionFromGroup: async (
    _parent: unknown,
    args: { connectionId: string; groupId: string },
  ) => {
    return connectionService.connection.removeConnectionFromGroup(
      args.connectionId,
      args.groupId,
    );
  },
  updateConnectionTraits: async (
    _parent: unknown,
    args: { connectionId: string; traitIds: string[] },
  ) => {
    return connectionService.connection.updateConnectionTraitGroups(
      args.connectionId,
      args.traitIds,
    );
  },
};
