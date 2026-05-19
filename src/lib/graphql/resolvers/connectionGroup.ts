import { prisma } from "@/lib/database/prisma";
import { NotFoundError } from "../errors";
import { GraphQLContext } from "./context";

interface CreateConnectionGroupInput {
  name: string;
  traitIds?: string[];
}

interface UpdateConnectionGroupInput {
  name?: string;
  traitIds?: string[];
}

export const ConnectionGroup = {
  account: (parent: { accountId: string }) => {
    return prisma.account.findUnique({ where: { id: parent.accountId } });
  },
  connections: (parent: { id: string }) => {
    return prisma.connection.findMany({
      where: { connectionGroups: { some: { id: parent.id } } },
    });
  },
  traits: (parent: { id: string }) => {
    return prisma.trait.findMany({
      where: { visibleGroups: { some: { id: parent.id } } },
    });
  },
};

export const Query = {
  myConnectionGroups: (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return prisma.connectionGroup.findMany({
      where: { accountId: context.authedAccountId },
    });
  },
};

export const Mutation = {
  createConnectionGroup: async (
    _parent: unknown,
    args: { input: CreateConnectionGroupInput },
    context: GraphQLContext,
  ) => {
    const traits =
      args.input.traitIds !== undefined
        ? args.input.traitIds?.map((t) => {
            return { id: t };
          })
        : [];

    return prisma.connectionGroup.create({
      data: {
        name: args.input.name,
        ...(traits.length !== 0 ? { traits: { connect: traits } } : {}),
        accountId: context.authedAccountId,
      },
    });
  },
  updateConnectionGroup: async (
    _parent: unknown,
    args: { id: string; input: UpdateConnectionGroupInput },
    _context: GraphQLContext,
  ) => {
    const group = await prisma.connectionGroup.findUnique({
      where: { id: args.id },
    });
    if (group === null) {
      throw new NotFoundError("Connection group not found");
    }
    return prisma.connectionGroup.update({
      where: { id: args.id },
      data: args.input,
    });
  },
  deleteConnectionGroup: async (
    _parent: unknown,
    args: { id: string },
    _context: GraphQLContext,
  ) => {
    const group = await prisma.connectionGroup.findUnique({
      where: { id: args.id },
    });
    if (group === null) {
      throw new NotFoundError("Connection group not found");
    }
    await prisma.connectionGroup.delete({ where: { id: args.id } });
    return true;
  },
  addTraitToGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
    _context: GraphQLContext,
  ) => {
    const group = await prisma.connectionGroup.findUnique({
      where: { id: args.groupId },
    });
    if (group === null) {
      throw new NotFoundError("Connection group not found");
    }
    return prisma.connectionGroup.update({
      where: { id: args.groupId },
      data: { traits: { connect: { id: args.traitId } } },
    });
  },
  removeTraitFromGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
    _context: GraphQLContext,
  ) => {
    return prisma.connectionGroup.update({
      where: { id: args.groupId },
      data: { traits: { disconnect: [{ id: args.traitId }] } },
      include: { traits: true },
    });
  },
};
