import { prisma } from "@/lib/database/prisma";
import { NotFoundError, UnauthorizedError } from "../errors";
import { GraphqlContext } from "./context";

interface UpdateAccountInput {
  displayName: string;
  username: string;
  publicListed: boolean;
}

export const Account = {
  traits: async (
    parent: { id: string },
    _args: unknown,
    context: GraphqlContext,
  ) => {
    if (parent.id === context.authedAccountId) {
      return prisma.trait.findMany({
        where: {
          accountId: context.authedAccountId,
        },
      });
    }

    return prisma.trait.findMany({
      where: {
        visibleGroups: {
          some: {
            accountId: context.authedAccountId,
            AND: {
              connections: {
                some: {
                  accountId: parent.id,
                },
              },
            },
          },
        },
      },
    });
  },
  connections: (
    parent: { id: string },
    _args: unknown,
    context: GraphqlContext,
  ) => {
    if (parent.id === context.authedAccountId) {
      return prisma.connection.findMany({
        where: { accountId: context.authedAccountId },
      });
    }

    throw new UnauthorizedError("Connections are private");
  },
  connectionGroups: (parent: { id: string }) => {
    return prisma.connectionGroup.findMany({
      where: { accountId: parent.id },
    });
  },
};

export const Query = {
  me: async (_parent: unknown, _args: unknown, context: GraphqlContext) => {
    const account = await prisma.account.findUnique({
      where: {
        id: context.authedAccountId,
      },
    });

    if (account === null) {
      throw new NotFoundError("account not found");
    }

    return account;
  },
  accountByUsername: (
    _parent: unknown,
    args: { username: string },
    _context: GraphqlContext,
  ) => {
    return prisma.account.findMany({
      where: {
        publicListed: true,
        username: {
          contains: args.username,
          mode: "insensitive",
        },
      },
    });
  },
  accountByShareId: (_parent: unknown, _args: { shareId: string }) => {
    throw new Error("Not implemented");
  },
};

export const Mutation = {
  updateAccount: async (
    root: unknown,
    args: { input: UpdateAccountInput },
    context: GraphqlContext,
  ) => {
    const account = await prisma.account.findUnique({
      where: { id: context.authedAccountId },
    });
    if (account === null) {
      throw new NotFoundError("account not found");
    }
    return prisma.account.update({
      where: { id: context.authedAccountId },
      data: args.input,
    });
  },
};
