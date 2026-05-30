import { NotFoundError, UnauthorizedError } from "../errors";
import { GraphQLContext } from "./context";
import userService from "@/lib/services/userService";

interface UpdateUserInput {
  displayName: string;
  username: string;
  publicListed: boolean;
}

export const User = {
  traits: async (
    parent: { id: string },
    _args: unknown,
    context: GraphQLContext,
  ) => {
    if (!context.authedUserId) {
      throw new UnauthorizedError("Not authenticated");
    }

    if (parent.id === context.authedUserId) {
      return userService.search.findUserTraitsForOwner(context.authedUserId);
    }

    return userService.search.findUserTraitsForViewer(
      parent.id,
      context.authedUserId,
    );
  },
  connections: (
    parent: { id: string },
    _args: unknown,
    context: GraphQLContext,
  ) => {
    if (!context.authedUserId) {
      throw new UnauthorizedError("Not authenticated");
    }

    if (parent.id === context.authedUserId) {
      return userService.search.findUserConnections(context.authedUserId);
    }

    throw new UnauthorizedError("Connections are private");
  },
  connectionGroups: (parent: { id: string }) => {
    return userService.search.findUserConnectionGroups(parent.id);
  },
};

export const Query = {
  me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
    if (!context.authedUserId) {
      return null;
    }

    const user = await userService.user.findUserById(context.authedUserId);

    if (user === null) {
      throw new UnauthorizedError("user not found");
    }

    return user;
  },
  userByUsername: (
    _parent: unknown,
    args: { username: string },
    _context: GraphQLContext,
  ) => {
    return userService.search.findUsersByUsername(args.username);
  },
  searchUsers: (
    _parent: unknown,
    args: { query: string },
    _context: GraphQLContext,
  ) => {
    return userService.search.findUsersByUsername(args.query);
  },
  userByShareId: (_parent: unknown, _args: { shareId: string }) => {
    throw new Error("Not implemented");
  },
};

export const Mutation = {
  updateUser: async (
    root: unknown,
    args: { input: UpdateUserInput },
    context: GraphQLContext,
  ) => {
    if (!context.authedUserId) {
      throw new UnauthorizedError("Not authenticated");
    }

    const user = await userService.user.findUserById(context.authedUserId);
    if (user === null) {
      throw new NotFoundError("user not found");
    }
    return userService.user.updateUser(context.authedUserId, args.input);
  },
};
