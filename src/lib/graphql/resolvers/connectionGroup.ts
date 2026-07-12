import type {
  ConnectionGroupResolvers,
  QueryResolvers,
  MutationResolvers,
} from "@/generated/graphql/server";
import connectionGroupService from "@/lib/services/connectionGroupService";

export const ConnectionGroup: ConnectionGroupResolvers = {
  /**
   * Resolves the `account` field on the ConnectionGroup type.
   * Fetches the owning user account for this group.
   *
   * @param parent - The parent ConnectionGroup object.
   * @returns The user account that owns this group.
   * @throws {Error} If the group has no accountId or the account is not found.
   */
  account: async (parent) => {
    if (!parent.accountId) throw new Error("ConnectionGroup has no accountId");
    const account = await connectionGroupService.search.findAccountForGroup(
      parent.accountId,
    );
    if (!account) throw new Error("Account not found for connection group");
    return account;
  },
  /**
   * Resolves the `sides` field on the ConnectionGroup type.
   * Returns all connection sides belonging to this group.
   *
   * @param parent - The parent ConnectionGroup object.
   * @returns An array of connection sides linked to this group.
   */
  sides: (parent) => {
    return connectionGroupService.search.findSidesForGroup(parent.id);
  },
  /**
   * Resolves the `traits` field on the ConnectionGroup type.
   * Returns all traits linked to this group.
   *
   * @param parent - The parent ConnectionGroup object.
   * @returns An array of traits visible through this group.
   */
  traits: (parent) => {
    return connectionGroupService.search.findTraitsForGroup(parent.id);
  },
};

export const Query: Pick<QueryResolvers, "myConnectionGroups"> = {
  /**
   * Resolves the `myConnectionGroups` query. Returns all connection groups
   * for the authenticated user.
   *
   * @returns An array of the authenticated user's connection groups.
   * @throws {AuthenticationError} If not authenticated.
   */
  myConnectionGroups: async () => {
    return connectionGroupService.search.findConnectionGroupsByAccountId();
  },
};

export const Mutation: Pick<
  MutationResolvers,
  | "createConnectionGroup"
  | "updateConnectionGroup"
  | "deleteConnectionGroup"
  | "addTraitToGroup"
  | "removeTraitFromGroup"
> = {
  /**
   * Resolves the `createConnectionGroup` mutation. Creates a new connection group
   * for the authenticated user, optionally linking traits.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `input` with name and optional traitIds.
   * @returns The newly created connection group record.
   * @throws {AuthenticationError} If not authenticated.
   */
  createConnectionGroup: async (_parent, args) => {
    return connectionGroupService.connectionGroup.createConnectionGroup(
      args.input.name,
      args.input.traitIds ?? undefined,
    );
  },
  /**
   * Resolves the `updateConnectionGroup` mutation. Updates the name and/or trait
   * associations of a connection group owned by the authenticated user.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `id` and `input` with optional name and traitIds.
   * @returns The updated connection group record.
   * @throws {AuthenticationError} If not authenticated.
   * @throws {NotFoundError} If the connection group does not exist.
   * @throws {AuthorizationError} If the group is not owned by the authenticated user.
   */
  updateConnectionGroup: async (_parent, args) => {
    return connectionGroupService.connectionGroup.updateConnectionGroup(
      args.id,
      {
        name: args.input.name ?? undefined,
        traitIds: args.input.traitIds ?? undefined,
      },
    );
  },
  /**
   * Resolves the `deleteConnectionGroup` mutation. Deletes a connection group
   * owned by the authenticated user.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `id`.
   * @returns `true` on successful deletion.
   * @throws {AuthenticationError} If not authenticated.
   * @throws {NotFoundError} If the connection group does not exist.
   * @throws {AuthorizationError} If the group is not owned by the authenticated user.
   */
  deleteConnectionGroup: async (_parent, args) => {
    await connectionGroupService.connectionGroup.deleteConnectionGroup(args.id);
    return true;
  },
  /**
   * Resolves the `addTraitToGroup` mutation. Adds a trait to a connection group
   * owned by the authenticated user.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `groupId` and `traitId`.
   * @returns The updated connection group record.
   * @throws {AuthenticationError} If not authenticated.
   * @throws {NotFoundError} If the connection group does not exist.
   * @throws {AuthorizationError} If the group is not owned by the authenticated user.
   */
  addTraitToGroup: async (_parent, args) => {
    return connectionGroupService.connectionGroup.addTraitToGroup(
      args.groupId,
      args.traitId,
    );
  },
  /**
   * Resolves the `removeTraitFromGroup` mutation. Removes a trait from a connection
   * group owned by the authenticated user.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `groupId` and `traitId`.
   * @returns The updated connection group record.
   * @throws {AuthenticationError} If not authenticated.
   * @throws {NotFoundError} If the connection group does not exist.
   * @throws {AuthorizationError} If the group is not owned by the authenticated user.
   */
  removeTraitFromGroup: async (_parent, args) => {
    return connectionGroupService.connectionGroup.removeTraitFromGroup(
      args.groupId,
      args.traitId,
    );
  },
};
