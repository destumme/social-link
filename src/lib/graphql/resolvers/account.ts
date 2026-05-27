import { NotFoundError, UnauthorizedError } from "../errors";
import { GraphQLContext } from "./context";
import accountService from "@/lib/services/accountService";

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
      return accountService.search.findAccountTraitsForOwner(
        context.authedAccountId,
      );
    }

    return accountService.search.findAccountTraitsForViewer(
      parent.id,
      context.authedAccountId,
    );
  },
  connections: (
    parent: { id: string },
    _args: unknown,
    context: GraphQLContext,
  ) => {
    if (parent.id === context.authedAccountId) {
      return accountService.search.findAccountConnections(
        context.authedAccountId,
      );
    }

    throw new UnauthorizedError("Connections are private");
  },
  connectionGroups: (parent: { id: string }) => {
    return accountService.search.findAccountConnectionGroups(parent.id);
  },
};

export const Query = {
  me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
    const account = await accountService.account.findAccountById(
      context.authedAccountId,
    );

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
    return accountService.search.findAccountsByUsername(args.username);
  },
  searchAccounts: (
    _parent: unknown,
    args: { query: string },
    _context: GraphQLContext,
  ) => {
    return accountService.search.findAccountsByUsername(args.query);
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
    const account = await accountService.account.findAccountById(
      context.authedAccountId,
    );
    if (account === null) {
      throw new NotFoundError("account not found");
    }
    return accountService.account.updateAccount(
      context.authedAccountId,
      args.input,
    );
  },
};
