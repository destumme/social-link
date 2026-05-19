import { prisma } from "@/lib/database/prisma";
import { GraphQLContext } from "./context";

interface RequestConnectionInput {
  groupIds?: string[];
  sharedTraitIds?: string[];
}

export const Connection = {
  account: (parent: { accountId: string }) => {
    return prisma.account.findUnique({ where: { id: parent.accountId } });
  },
  connectedAccount: (parent: { connectedAccountId: string }) => {
    return prisma.account.findUnique({
      where: { id: parent.connectedAccountId },
    });
  },
  groups: (parent: { id: string }) => {
    return prisma.connectionGroup.findMany({
      where: { connections: { some: { id: parent.id } } },
    });
  },
};

export const Query = {
  myConnections: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return prisma.connection.findMany({
      where: { accountId: context.authedAccountId },
    });
  },
  pendingConnections: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return prisma.connection.findMany({
      where: { connectedAccountId: context.authedAccountId, status: "PENDING" },
    });
  },
  connectionByAccount: (
    _parent: unknown,
    args: { accountId: string },
    context: GraphQLContext,
  ) => {
    return prisma.connection.findFirst({
      where: {
        accountId: context.authedAccountId,
        connectedAccountId: args.accountId,
      },
    });
  },
};

export const Mutation = {
  requestConnection: async (
    _parent: unknown,
    args: { accountId: string; input: RequestConnectionInput },
    context: GraphQLContext,
  ) => {
    const groupIds = args.input.groupIds ?? [];
    return prisma.connection.create({
      data: {
        accountId: context.authedAccountId,
        connectedAccountId: args.accountId,
        status: "PENDING",
        ...(groupIds.length > 0
          ? {
              connectionGroups: {
                connect: groupIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });
  },
  acceptConnection: async (
    _parent: unknown,
    args: { connectionId: string },
    _context: GraphQLContext,
  ) => {
    return prisma.connection.update({
      where: { id: args.connectionId },
      data: { status: "ACCEPTED" },
    });
  },
  declineConnection: async (
    _parent: unknown,
    args: { connectionId: string },
    _context: GraphQLContext,
  ) => {
    return prisma.connection.update({
      where: { id: args.connectionId },
      data: { status: "DECLINED" },
    });
  },
  removeConnection: async (
    _parent: unknown,
    args: { id: string },
    _context: GraphQLContext,
  ) => {
    await prisma.connection.delete({ where: { id: args.id } });
    return true;
  },
  addConnectionToGroup: async (
    _parent: unknown,
    args: { connectionId: string; groupId: string },
    _context: GraphQLContext,
  ) => {
    return prisma.connection.update({
      where: { id: args.connectionId },
      data: { connectionGroups: { connect: { id: args.groupId } } },
    });
  },
  removeConnectionFromGroup: async (
    _parent: unknown,
    args: { connectionId: string; groupId: string },
    _context: GraphQLContext,
  ) => {
    return prisma.connection.update({
      where: { id: args.connectionId },
      data: { connectionGroups: { disconnect: { id: args.groupId } } },
    });
  },
  updateConnectionTraits: async (
    _parent: unknown,
    args: { connectionId: string; traitIds: string[] },
    _context: GraphQLContext,
  ) => {
    const groups = await prisma.connectionGroup.findMany({
      where: { traits: { some: { id: { in: args.traitIds } } } },
    });
    return prisma.connection.update({
      where: { id: args.connectionId },
      data: {
        connectionGroups: {
          set: groups.map((g) => ({ id: g.id })),
        },
      },
    });
  },
};
