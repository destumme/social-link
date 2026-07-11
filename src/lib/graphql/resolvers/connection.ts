import type {
  ConnectionResolvers,
  ConnectionSideResolvers,
  QueryResolvers,
  MutationResolvers,
} from "@/generated/graphql/server";
import type { UserModel } from "@/generated/prisma/models/User";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
} from "@/lib/services/errors";
import connectionService from "@/lib/services/connectionService";

export const Connection: ConnectionResolvers = {
  initiator: (parent) => {
    return connectionService.search.findUserById(
      parent.initiatorId,
    ) as Promise<UserModel>;
  },
  recipient: (parent) => {
    return connectionService.search.findUserById(
      parent.recipientId,
    ) as Promise<UserModel>;
  },
  sides: (parent) => {
    return connectionService.search.findSidesForConnection(parent.id);
  },
};

export const ConnectionSide: ConnectionSideResolvers = {
  account: (parent) => {
    return connectionService.search.findUserById(
      parent.accountId,
    ) as Promise<UserModel>;
  },
  groups: (parent) => {
    return connectionService.search.findGroupsForSide(parent.id);
  },
};

export const Query: Pick<
  QueryResolvers,
  "myConnections" | "pendingConnections" | "connectionByAccount"
> = {
  myConnections: async () => {
    return connectionService.search.findConnectionsByAccountId("ACCEPTED");
  },
  pendingConnections: async () => {
    return connectionService.search.findPendingConnectionsForAccount();
  },
  connectionByAccount: async (_parent, args) => {
    return connectionService.search.findConnectionBetweenAccounts(
      args.accountId,
    );
  },
};

export const Mutation: Pick<
  MutationResolvers,
  | "requestConnection"
  | "acceptConnection"
  | "declineConnection"
  | "removeConnection"
  | "addConnectionToGroup"
  | "removeConnectionFromGroup"
  | "updateConnectionGroups"
  | "updateConnectionTraits"
> = {
  requestConnection: async (_parent, args) => {
    const existing = await connectionService.search.checkConnectionExists(
      args.accountId,
    );
    if (existing) {
      throw new ConflictError("Connection already exists");
    }
    return connectionService.connectionPair.createConnectionPair(
      args.accountId,
      args.input.groupIds ?? undefined,
    );
  },
  acceptConnection: async (_parent, args) => {
    const connection = await connectionService.connection.findConnectionById(
      args.connectionId,
    );
    if (!connection) throw new NotFoundError("Connection not found");
    if (connection.status !== "PENDING") {
      throw new BadRequestError("Connection must be PENDING");
    }
    return connectionService.connectionPair.acceptConnectionPair(connection.id);
  },
  declineConnection: async (_parent, args) => {
    const connection = await connectionService.connection.findConnectionById(
      args.connectionId,
    );
    if (!connection) throw new NotFoundError("Connection not found");
    if (connection.status !== "PENDING") {
      throw new BadRequestError("Connection must be PENDING");
    }
    await connectionService.connectionPair.declineConnectionPair(connection.id);
    return true;
  },
  removeConnection: async (_parent, args) => {
    const connection = await connectionService.connection.findConnectionById(
      args.id,
    );
    if (!connection) throw new NotFoundError("Connection not found");
    await connectionService.connectionPair.deleteConnectionPair(connection.id);
    return true;
  },
  addConnectionToGroup: async (_parent, args) => {
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
  removeConnectionFromGroup: async (_parent, args) => {
    return connectionService.connection.removeConnectionFromGroup(
      args.connectionId,
      args.groupId,
    );
  },
  updateConnectionGroups: async (_parent, args) => {
    return connectionService.connection.updateConnectionGroups(
      args.connectionId,
      args.groupIds,
    );
  },
  updateConnectionTraits: async (_parent, args) => {
    await connectionService.connection.updateConnectionTraitGroups(
      args.connectionId,
      args.traitIds,
    );
    const connection = await connectionService.connection.findConnectionById(
      args.connectionId,
    );
    if (!connection) throw new NotFoundError("Connection not found");
    return connection;
  },
};
