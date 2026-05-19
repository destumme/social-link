import { prisma } from "@/lib/database/prisma";
import { NotFoundError } from "../errors";
import { GraphqlContext } from "./context";

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
    throw new Error("Not implemented");
  },
  connections: (parent: { connections: string[] }) => {
    throw new Error("Not implemented");
  },
  traits: (parent: { traits: string[] }) => {
    throw new Error("Not implemented");
  },
};

export const Query = {
  myConnectionGroups: (
    _parent: unknown,
    _args: unknown,
    context: GraphqlContext,
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
    context: GraphqlContext,
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
    _context: GraphqlContext,
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
    _context: GraphqlContext,
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
    _context: GraphqlContext,
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
    _context: GraphqlContext,
  ) => {
    return prisma.connectionGroup.update({
      where: { id: args.groupId },
      data: { traits: { disconnect: [{ id: args.traitId }] } },
      include: { traits: true },
    });
  },
};
