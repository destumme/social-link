import type {
  UserResolvers,
  QueryResolvers,
  MutationResolvers,
} from "@/generated/graphql/server";
import { AuthenticationError, NotFoundError } from "@/lib/services/errors";
import { getAuthedAccountId } from "@/lib/auth-server";
import userService from "@/lib/services/userService";

export const User: UserResolvers = {
  /**
   * Resolves the `traits` field on the User type.
   *
   * If the viewer is the owner, returns all their traits. Otherwise, returns
   * only traits visible to the viewer through shared connection groups.
   *
   * @param parent - The parent User object.
   * @returns An array of traits visible to the current viewer.
   * @throws {AuthenticationError} If the viewer is not authenticated.
   */
  traits: async (parent) => {
    const authedUserId = await getAuthedAccountId();
    if (!authedUserId) {
      throw new AuthenticationError("Not authenticated");
    }

    if (parent.id === authedUserId) {
      return userService.search.findUserTraitsForOwner();
    }

    return userService.search.findUserTraitsForViewer(parent.id);
  },
  /**
   * Resolves the `connections` field on the User type.
   *
   * Only the authenticated owner can view their own connections;
   * viewing another user's connections throws an error.
   *
   * @param parent - The parent User object.
   * @returns An array of the user's connections.
   * @throws {AuthenticationError} If not authenticated or attempting to view another user's connections.
   */
  connections: async (parent) => {
    const authedUserId = await getAuthedAccountId();
    if (!authedUserId) {
      throw new AuthenticationError("Not authenticated");
    }

    if (parent.id === authedUserId) {
      return userService.search.findUserConnections();
    }

    throw new AuthenticationError("Connections are private");
  },
  /**
   * Resolves the `connectionGroups` field on the User type.
   *
   * @param parent - The parent User object.
   * @returns An array of the user's connection groups.
   */
  connectionGroups: (parent) => {
    return userService.search.findUserConnectionGroups(parent.id);
  },
};

export const Query: Pick<
  QueryResolvers,
  "me" | "userByUsername" | "searchUsers" | "userByShareId"
> = {
  /**
   * Resolves the `me` query. Returns the currently authenticated user or `null`.
   *
   * @returns The authenticated user record, or `null` if not logged in.
   * @throws {NotFoundError} If the authenticated user ID does not match any user record.
   */
  me: async () => {
    const authedUserId = await getAuthedAccountId();
    if (!authedUserId) {
      return null;
    }

    const user = await userService.user.findUserById(authedUserId);

    if (user === null) {
      throw new NotFoundError("user not found");
    }

    return user;
  },
  /**
   * Resolves the `userByUsername` query. Returns the first publicly listed user
   * matching the given username, or `null`.
   *
   * @param _parent - Root value (unused).
   * @param args - Query arguments containing `username`.
   * @returns The matching user, or `null` if not found.
   */
  userByUsername: async (_parent, args) => {
    return userService.search.findUserByUsernameExact(args.username);
  },
  /**
   * Resolves the `searchUsers` query. Returns all publicly listed users matching the query string.
   *
   * @param _parent - Root value (unused).
   * @param args - Query arguments containing `query`.
   * @returns An array of matching users.
   */
  searchUsers: (_parent, args) => {
    return userService.search.searchUsersByUsername(args.query);
  },
  /**
   * Resolves the `userByShareId` query. Not yet implemented.
   *
   * @throws {Error} Always throws "Not implemented".
   */
  userByShareId: () => {
    throw new Error("Not implemented");
  },
};

export const Mutation: Pick<MutationResolvers, "updateUser"> = {
  /**
   * Resolves the `updateUser` mutation. Updates the authenticated user's profile fields.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `input` with optional displayName, username, publicListed.
   * @returns The updated user record.
   * @throws {AuthenticationError} If not authenticated or user not found.
   */
  updateUser: async (_parent, args) => {
    const { displayName, username, publicListed } = args.input;
    return userService.user.updateUser({
      displayName: displayName ?? undefined,
      username: username ?? undefined,
      publicListed: publicListed ?? undefined,
    });
  },
};
