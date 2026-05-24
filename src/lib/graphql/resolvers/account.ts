import { NotFoundError, UnauthorizedError } from "../errors";
import { GraphQLContext } from "./context";
import {
  findAccountById,
  findAccountsByUsername,
  updateAccount,
  findAccountTraitsForOwner,
  findAccountTraitsForViewer,
  findAccountConnections,
  findAccountConnectionGroups,
} from "@/lib/services/accountService";

interface UpdateAccountInput {
  displayName: string;
  username: string;
  publicListed: boolean;
}

export const Account = {
  traits: async (
    parent: { id: string },
    _args: unknown,
    context: GraphQLContext,
  ) => {
    if (parent.id === context.authedAccountId) {
      return findAccountTraitsForOwner(context.authedAccountId);
    }

    return findAccountTraitsForViewer(parent.id, context.authedAccountId);
  },
  connections: (
    parent: { id: string },
    _args: unknown,
    context: GraphQLContext,
  ) => {
    if (parent.id === context.authedAccountId) {
      return findAccountConnections(context.authedAccountId);
    }

    throw new UnauthorizedError("Connections are private");
  },
  connectionGroups: (parent: { id: string }) => {
    return findAccountConnectionGroups(parent.id);
  },
};

export const Query = {
  me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
    const account = await findAccountById(context.authedAccountId);

    if (account === null) {
      throw new UnauthorizedError("account not found");
    }

    return account;
  },
  accountByUsername: (
    _parent: unknown,
    args: { username: string },
    _context: GraphQLContext,
  ) => {
    return findAccountsByUsername(args.username);
  },
  accountByShareId: (_parent: unknown, _args: { shareId: string }) => {
    throw new Error("Not implemented");
  },
};

export const Mutation = {
  updateAccount: async (
    root: unknown,
    args: { input: UpdateAccountInput },
    context: GraphQLContext,
  ) => {
    const account = await findAccountById(context.authedAccountId);
    if (account === null) {
      throw new NotFoundError("account not found");
    }
    return updateAccount(context.authedAccountId, args.input);
  },
};
