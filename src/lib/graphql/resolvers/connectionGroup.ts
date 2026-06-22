import connectionGroupService from "@/lib/services/connectionGroupService";

interface CreateConnectionGroupInput {
  name: string;
  traitIds?: string[];
}

interface UpdateConnectionGroupInput {
  name?: string;
  traitIds?: string[];
  connectionIds?: string[];
}

export const ConnectionGroup = {
  account: (parent: { accountId: string }) => {
    return connectionGroupService.search.findAccountForGroup(parent.accountId);
  },
  connections: (parent: { id: string }) => {
    return connectionGroupService.search.findConnectionsForGroup(parent.id);
  },
  traits: (parent: { id: string }) => {
    return connectionGroupService.search.findTraitsForGroup(parent.id);
  },
};

export const Query = {
  myConnectionGroups: async () => {
    return connectionGroupService.search.findConnectionGroupsByAccountId();
  },
};

export const Mutation = {
  createConnectionGroup: async (
    _parent: unknown,
    args: { input: CreateConnectionGroupInput },
  ) => {
    return connectionGroupService.connectionGroup.createConnectionGroup(
      args.input.name,
      args.input.traitIds,
    );
  },
  updateConnectionGroup: async (
    _parent: unknown,
    args: { id: string; input: UpdateConnectionGroupInput },
  ) => {
    return connectionGroupService.connectionGroup.updateConnectionGroup(
      args.id,
      args.input,
    );
  },
  deleteConnectionGroup: async (_parent: unknown, args: { id: string }) => {
    await connectionGroupService.connectionGroup.deleteConnectionGroup(args.id);
    return true;
  },
  addTraitToGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
  ) => {
    return connectionGroupService.connectionGroup.addTraitToGroup(
      args.groupId,
      args.traitId,
    );
  },
  removeTraitFromGroup: async (
    _parent: unknown,
    args: { groupId: string; traitId: string },
  ) => {
    return connectionGroupService.connectionGroup.removeTraitFromGroup(
      args.groupId,
      args.traitId,
    );
  },
};
