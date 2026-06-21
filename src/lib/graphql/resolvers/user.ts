import { AuthenticationError, NotFoundError } from "@/lib/services/errors";
import { getAuthedAccountId } from "@/lib/auth-server";
import userService from "@/lib/services/userService";

interface UpdateUserInput {
  displayName: string;
  username: string;
  publicListed: boolean;
}

export const User = {
  traits: async (parent: { id: string }) => {
    const authedUserId = await getAuthedAccountId();
    if (!authedUserId) {
      throw new AuthenticationError("Not authenticated");
    }

    if (parent.id === authedUserId) {
      return userService.search.findUserTraitsForOwner();
    }

    return userService.search.findUserTraitsForViewer(parent.id);
  },
  connections: async (parent: { id: string }) => {
    const authedUserId = await getAuthedAccountId();
    if (!authedUserId) {
      throw new AuthenticationError("Not authenticated");
    }

    if (parent.id === authedUserId) {
      return userService.search.findUserConnections();
    }

    throw new AuthenticationError("Connections are private");
  },
  connectionGroups: (parent: { id: string }) => {
    return userService.search.findUserConnectionGroups(parent.id);
  },
};

export const Query = {
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
  userByUsername: async (_parent: unknown, args: { username: string }) => {
    const users = await userService.search.findUsersByUsername(args.username);
    return users[0] ?? null;
  },
  searchUsers: (_parent: unknown, args: { query: string }) => {
    return userService.search.findUsersByUsername(args.query);
  },
  userByShareId: (parent: unknown, args: { shareId: string }) => {
    void parent;
    void args;
    throw new Error("Not implemented");
  },
};

export const Mutation = {
  updateUser: async (root: unknown, args: { input: UpdateUserInput }) => {
    return userService.user.updateUser(args.input);
  },
};
