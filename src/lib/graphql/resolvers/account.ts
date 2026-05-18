import { NotFoundError } from "@/lib/errors";
import { GraphqlContext } from "./context";

interface UpdateAccountInput {
  displayName?: string;
  username?: string;
  publicListed?: boolean;
}

export const Account = {
  traits: (parent: { id: string }) => {
    throw new Error("Not implemented");
  },
  connections: (parent: { id: string }) => {
    throw new Error("Not implemented");
  },
  connectionGroups: (parent: { id: string }) => {
    throw new Error("Not implemented");
  },
};

export const Query = {
  me: (_parent: unknown, _args: unknown, context: GraphqlContext) => {
    if (context.accountId === "" || context.accountId === undefined) {
      throw new NotFoundError();
    }
    return context.services.accounts.findById(context.accountId);
  },
  accountByUsername: (_parent: unknown, _args: { username: string }) => {
    throw new Error("Not implemented");
  },
  accountByShareId: (_parent: unknown, _args: { shareId: string }) => {
    throw new Error("Not implemented");
  },
};

export const Mutation = {
  updateAccount: (
    _parent: unknown,
    _args: { input: UpdateAccountInput },
    _context: GraphqlContext,
  ) => {
    throw new Error("Not implemented");
  },
};
