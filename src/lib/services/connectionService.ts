import { Connection } from "@/generated/prisma/client";
import { prisma } from "@/lib/database/prisma";
import { NotFoundError } from "@/lib/errors";

interface RequestConnectionInput {
  groupIds?: string[];
  sharedTraitIds?: string[];
}

export const connectionService = {
  /**
   * Helper for type resolvers.
   * @param id - The connection ID.
   * @returns The connection or null.
   */
  findById: async (id: string): Promise<Connection> => {
    const connection = await prisma.connection.findUnique({ where: { id } });
    if (connection === null) {
      throw new NotFoundError("Connection not found", {
        domain: "connections",
      });
    }
    return connection;
  },

  /**
   * myConnections query, Account.connections resolver.
   * @param accountId - The account ID.
   * @returns Array of connections.
   */
  findByAccountId: async (accountId: string): Promise<Connection[]> => {
    return prisma.connection.findMany({
      where: { accountId },
    });
  },

  /**
   * pendingConnections query.
   * @param accountId - The account ID.
   * @returns Array of pending connections.
   */
  findPendingByAccountId: async (_accountId: string): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * connectionByAccount query.
   * @param accountId - The connected account ID.
   * @returns The connection or null.
   */
  findByConnectedAccountId: async (_accountId: string): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * requestConnection mutation.
   * @param accountId - The requesting account ID.
   * @param targetAccountId - The target account ID.
   * @param input - The connection request data.
   * @returns The created connection.
   */
  request: async (
    _accountId: string,
    _targetAccountId: string,
    _input: RequestConnectionInput,
  ): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * acceptConnection mutation.
   * @param connectionId - The connection ID.
   * @returns The accepted connection.
   */
  accept: async (_connectionId: string): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * declineConnection mutation.
   * @param connectionId - The connection ID.
   * @returns True if declined.
   */
  decline: async (_connectionId: string): Promise<boolean> => {
    throw new Error("Not implemented");
  },

  /**
   * removeConnection mutation.
   * @param id - The connection ID.
   * @returns True if removed.
   */
  delete: async (_id: string): Promise<boolean> => {
    //this deletes the connection on both sides
    throw new Error("Not implemented");
  },

  /**
   * addConnectionToGroup mutation.
   * @param connectionId - The connection ID.
   * @param groupId - The group ID.
   * @returns The updated connection.
   */
  addToGroup: async (
    _connectionId: string,
    _groupId: string,
  ): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * removeConnectionFromGroup mutation.
   * @param connectionId - The connection ID.
   * @param groupId - The group ID.
   * @returns The updated connection.
   */
  removeFromGroup: async (
    _connectionId: string,
    _groupId: string,
  ): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * updateConnectionTraits mutation.
   * @param connectionId - The connection ID.
   * @param traitIds - Array of trait IDs to share.
   * @returns The updated connection.
   */
  updateTraits: async (
    _connectionId: string,
    _traitIds: string[],
  ): Promise<unknown> => {
    throw new Error("Not implemented");
  },
};
