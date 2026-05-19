import { ConnectionGroup } from "@/generated/prisma/client";
import { prisma } from "@/lib/database/prisma";
import { NotFoundError } from "@/lib/errors";

interface CreateConnectionGroupInput {
  name: string;
  traitIds?: string[];
}

interface UpdateConnectionGroupInput {
  name?: string;
  traitIds?: string[];
}

export const connectionGroupService = {
  /**
   * Helper for type resolvers.
   * @param id - The connection group ID.
   * @returns The connection group or null.
   */
  findById: async (id: string): Promise<ConnectionGroup> => {
    const group = await prisma.connectionGroup.findUnique({ where: { id } });
    if (group === null) {
      throw new NotFoundError("Connection group not found", {
        domain: "connectionGroups",
      });
    }
    return group;
  },

  /**
   * myConnectionGroups query, Account.connectionGroups resolver.
   * @param accountId - The account ID.
   * @returns Array of connection groups.
   */
  findByAccountId: async (accountId: string): Promise<ConnectionGroup[]> => {
    return prisma.connectionGroup.findMany({
      where: { accountId },
    });
  },

  /**
   * createConnectionGroup mutation.
   * @param accountId - The account ID.
   * @param input - The group creation data.
   * @returns The created connection group.
   */
  create: async (
    accountId: string,
    input: CreateConnectionGroupInput,
  ): Promise<ConnectionGroup> => {
    const traits =
      input.traitIds !== undefined
        ? input.traitIds?.map((t) => {
            return { id: t };
          })
        : [];

    return prisma.connectionGroup.create({
      data: {
        name: input.name,
        ...(traits.length !== 0 ? { traits: { connect: traits } } : {}),
      },
    });
  },

  /**
   * updateConnectionGroup mutation.
   * @param id - The connection group ID.
   * @param input - The update fields.
   * @returns The updated connection group.
   */
  update: async (
    id: string,
    input: UpdateConnectionGroupInput,
  ): Promise<ConnectionGroup> => {
    const group = await prisma.connectionGroup.findUnique({ where: { id } });
    if (group === null) {
      throw new NotFoundError("Connection group not found", {
        domain: "connectionGroups",
      });
    }
    return prisma.connectionGroup.update({
      where: { id },
      data: input,
    });
  },

  /**
   * deleteConnectionGroup mutation.
   * @param id - The connection group ID.
   * @returns True if deleted.
   */
  delete: async (id: string): Promise<boolean> => {
    const group = await prisma.connectionGroup.findUnique({ where: { id } });
    if (group === null) {
      throw new NotFoundError("Connection group not found", {
        domain: "connectionGroups",
      });
    }
    await prisma.connectionGroup.delete({ where: { id } });
    return true;
  },

  /**
   * addTraitToGroup mutation.
   * @param groupId - The group ID.
   * @param traitId - The trait ID.
   * @returns The updated connection group.
   */
  addTrait: async (
    groupId: string,
    traitId: string,
  ): Promise<ConnectionGroup> => {
    const group = await prisma.connectionGroup.findUnique({
      where: { id: groupId },
    });
    if (group === null) {
      throw new NotFoundError("Connection group not found", {
        domain: "connectionGroups",
      });
    }
    return prisma.connectionGroup.update({
      where: { id: groupId },
      data: { traits: { push: traitId } },
    });
  },

  /**
   * removeTraitFromGroup mutation.
   * @param groupId - The group ID.
   * @param traitId - The trait ID.
   * @returns The updated connection group.
   */
  removeTrait: async (
    groupId: string,
    traitId: string,
  ): Promise<ConnectionGroup> => {
    const group =  await prisma.connectionGroup.update({
      where: { id: groupId },
      data: { traits: { disconnect: [{ id: traitId }] } },
      include: {traits: true}
    });
  },
};
