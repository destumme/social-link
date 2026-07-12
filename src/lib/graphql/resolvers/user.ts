import type {
  UserResolvers,
  QueryResolvers,
  MutationResolvers,
} from "@/generated/graphql/server";
import { AuthenticationError, NotFoundError } from "@/lib/services/errors";
import { getAuthedAccountId } from "@/lib/auth-server";
import userService from "@/lib/services/userService";

export const User: UserResolvers = {
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
  connectionGroups: (parent) => {
    return userService.search.findUserConnectionGroups(parent.id);
  },
};

export const Query: Pick<
  QueryResolvers,
  "me" | "userByUsername" | "searchUsers" | "userByShareId"
> = {
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
  userByUsername: async (_parent, args) => {
    return userService.search.findUserByUsernameExact(args.username);
  },
  searchUsers: (_parent, args) => {
    return userService.search.searchUsersByUsername(args.query);
  },
  userByShareId: () => {
    throw new Error("Not implemented");
  },
};

export const Mutation: Pick<MutationResolvers, "updateUser"> = {
  updateUser: async (_parent, args) => {
    const { displayName, username, publicListed } = args.input;
    return userService.user.updateUser({
      displayName: displayName ?? undefined,
      username: username ?? undefined,
      publicListed: publicListed ?? undefined,
    });
  },
};
