import type {
  ConnectionResolvers,
  ConnectionSideResolvers,
  QueryResolvers,
  MutationResolvers,
} from "@/generated/graphql/server";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
} from "@/lib/services/errors";
import connectionService from "@/lib/services/connectionService";

export const Connection: ConnectionResolvers = {
  /**
   * Resolves the `initiator` field on the Connection type.
   * Fetches the user who initiated this connection.
   *
   * @param parent - The parent Connection object.
   * @returns The initiator user record.
   * @throws {Error} If the initiator user is not found.
   */
  initiator: async (parent) => {
    const user = await connectionService.search.findUserById(
      parent.initiatorId,
    );
    if (!user) throw new Error("Initiator not found");
    return user;
  },
  /**
   * Resolves the `recipient` field on the Connection type.
   * Fetches the user who received this connection request.
   *
   * @param parent - The parent Connection object.
   * @returns The recipient user record.
   * @throws {Error} If the recipient user is not found.
   */
  recipient: async (parent) => {
    const user = await connectionService.search.findUserById(
      parent.recipientId,
    );
    if (!user) throw new Error("Recipient not found");
    return user;
  },
  /**
   * Resolves the `sides` field on the Connection type.
   * Returns all connection sides for this connection.
   *
   * @param parent - The parent Connection object.
   * @returns An array of connection sides belonging to this connection.
   */
  sides: (parent) => {
    return connectionService.search.findSidesForConnection(parent.id);
  },
};

export const ConnectionSide: ConnectionSideResolvers = {
  /**
   * Resolves the `account` field on the ConnectionSide type.
   * Fetches the user account for this side of the connection.
   *
   * @param parent - The parent ConnectionSide object.
   * @returns The user account record.
   * @throws {Error} If the account is not found.
   */
  account: async (parent) => {
    const user = await connectionService.search.findUserById(parent.accountId);
    if (!user) throw new Error("Account not found");
    return user;
  },
  /**
   * Resolves the `groups` field on the ConnectionSide type.
   * Returns all connection groups this side belongs to.
   *
   * @param parent - The parent ConnectionSide object.
   * @returns An array of connection groups linked to this side.
   */
  groups: (parent) => {
    return connectionService.search.findGroupsForSide(parent.id);
  },
};

export const Query: Pick<
  QueryResolvers,
  "myConnections" | "pendingConnections" | "connectionByAccount"
> = {
  /**
   * Resolves the `myConnections` query. Returns all accepted connections
   * for the authenticated user.
   *
   * @returns An array of the authenticated user's accepted connections.
   * @throws {AuthenticationError} If not authenticated.
   */
  myConnections: async () => {
    return connectionService.search.findConnectionsByAccountId("ACCEPTED");
  },
  /**
   * Resolves the `pendingConnections` query. Returns all pending incoming
   * connection requests for the authenticated user.
   *
   * @returns An array of pending connections where the user is the recipient.
   * @throws {AuthenticationError} If not authenticated.
   */
  pendingConnections: async () => {
    return connectionService.search.findPendingConnectionsForAccount();
  },
  /**
   * Resolves the `connectionByAccount` query. Finds a connection between the
   * authenticated user and the specified account.
   *
   * @param _parent - Root value (unused).
   * @param args - Query arguments containing `accountId`.
   * @returns The connection record, or `null` if none exists.
   * @throws {AuthenticationError} If not authenticated.
   */
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
  /**
   * Resolves the `requestConnection` mutation. Creates a new pending connection
   * request to another account, after checking no connection already exists.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `accountId` and `input` with optional groupIds.
   * @returns The newly created connection record.
   * @throws {ConflictError} If a connection already exists between the two accounts.
   * @throws {AuthenticationError} If not authenticated.
   */
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
  /**
   * Resolves the `acceptConnection` mutation. Accepts a pending connection request.
   * Validates the connection exists and is in PENDING status before accepting.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `connectionId`.
   * @returns The updated connection record with ACCEPTED status.
   * @throws {NotFoundError} If the connection does not exist.
   * @throws {BadRequestError} If the connection is not in PENDING status.
   * @throws {AuthorizationError} If the authenticated user is not the recipient.
   */
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
  /**
   * Resolves the `declineConnection` mutation. Declines a pending connection request.
   * Validates the connection exists and is in PENDING status before declining.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `connectionId`.
   * @returns `true` on successful decline.
   * @throws {NotFoundError} If the connection does not exist.
   * @throws {BadRequestError} If the connection is not in PENDING status.
   * @throws {AuthorizationError} If the authenticated user is not the recipient.
   */
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
  /**
   * Resolves the `removeConnection` mutation. Deletes an existing connection.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `id`.
   * @returns `true` on successful deletion.
   * @throws {NotFoundError} If the connection does not exist.
   * @throws {AuthenticationError} If not authenticated.
   * @throws {AuthorizationError} If the user is neither initiator nor recipient.
   */
  removeConnection: async (_parent, args) => {
    const connection = await connectionService.connection.findConnectionById(
      args.id,
    );
    if (!connection) throw new NotFoundError("Connection not found");
    await connectionService.connectionPair.deleteConnectionPair(connection.id);
    return true;
  },
  /**
   * Resolves the `addConnectionToGroup` mutation. Adds an accepted connection
   * to a connection group. Validates the connection is in ACCEPTED status.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `connectionId` and `groupId`.
   * @returns The updated connection side record.
   * @throws {NotFoundError} If the connection or group does not exist.
   * @throws {BadRequestError} If the connection is not in ACCEPTED status.
   * @throws {AuthorizationError} If the user has no side or does not own the group.
   */
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
  /**
   * Resolves the `removeConnectionFromGroup` mutation. Removes a connection
   * from a connection group.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `connectionId` and `groupId`.
   * @returns The updated connection side record.
   * @throws {AuthorizationError} If the user has no side or does not own the group.
   * @throws {NotFoundError} If the group does not exist.
   */
  removeConnectionFromGroup: async (_parent, args) => {
    return connectionService.connection.removeConnectionFromGroup(
      args.connectionId,
      args.groupId,
    );
  },
  /**
   * Resolves the `updateConnectionGroups` mutation. Replaces all group memberships
   * for the authenticated user's side of a connection.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `connectionId` and `groupIds`.
   * @returns The updated connection side record.
   * @throws {AuthorizationError} If the user has no side on the connection.
   */
  updateConnectionGroups: async (_parent, args) => {
    return connectionService.connection.updateConnectionGroups(
      args.connectionId,
      args.groupIds,
    );
  },
  /**
   * Resolves the `updateConnectionTraits` mutation. Updates group memberships
   * for the authenticated user's side based on trait associations, then returns
   * the updated connection.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `connectionId` and `traitIds`.
   * @returns The updated connection record.
   * @throws {AuthorizationError} If the user has no side on the connection.
   * @throws {NotFoundError} If the connection is not found after update.
   */
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
