import { GraphqlContext } from "./context";
import { NotFoundError, UnauthorizedError } from "../errors";

interface UpdateAccountInput {
  displayName: string;
  username: string;
  publicListed: boolean;
}

export const Account = {
  traits: (parent: { id: string }, _args: unknown, context: GraphqlContext) => {
    if (parent.id === context.authedAccountId) {
      return context.services.traits.findByAccountId(context.authedAccountId);
    }

    return context.services.traits.findVisibleTraits(
      parent.id,
      context.authedAccountId,
    );
  },
  connections: (
    parent: { id: string },
    _args: unknown,
    context: GraphqlContext,
  ) => {
    if (parent.id === context.authedAccountId) {
      return context.services.connections.findByAccountId(
        context.authedAccountId,
      );
    }

    throw new UnauthorizedError("Connections are private");
  },
  connectionGroups: (
    parent: { id: string },
    _args: unknown,
    context: GraphqlContext,
  ) => {
    return context.services.groups.findByAccountId(parent.id);
  },
};

export const Query = {
  me: (_parent: unknown, _args: unknown, context: GraphqlContext) => {
    return context.services.accounts.findById(context.authedAccountId);
  },
  accountByUsername: (
    _parent: unknown,
    args: { username: string },
    context: GraphqlContext,
  ) => {
    return context.services.accounts.search(args.username);
  },
  accountByShareId: (_parent: unknown, _args: { shareId: string }) => {
    throw new Error("Not implemented");
  },
};

export const Mutation = {
  updateAccount: (
    root: unknown,
    args: { input: UpdateAccountInput },
    context: GraphqlContext,
  ) => {
    //todo: verify authorization
    const account = context.services.accounts.update(
      context.authedAccountId,
      args.input,
    );
  },
};
