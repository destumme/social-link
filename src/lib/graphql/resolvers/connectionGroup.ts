import type {
  ConnectionGroupResolvers,
  QueryResolvers,
  MutationResolvers,
} from "@/generated/graphql/server";
import connectionGroupService from "@/lib/services/connectionGroupService";

export const ConnectionGroup: ConnectionGroupResolvers = {
  account: async (parent) => {
    if (!parent.accountId) throw new Error("ConnectionGroup has no accountId");
    const account = await connectionGroupService.search.findAccountForGroup(
      parent.accountId,
    );
    if (!account) throw new Error("Account not found for connection group");
    return account;
  },
  sides: (parent) => {
    return connectionGroupService.search.findSidesForGroup(parent.id);
  },
  traits: (parent) => {
    return connectionGroupService.search.findTraitsForGroup(parent.id);
  },
};

export const Query: Pick<QueryResolvers, "myConnectionGroups"> = {
  myConnectionGroups: async () => {
    return connectionGroupService.search.findConnectionGroupsByAccountId();
  },
};

export const Mutation: Pick<
  MutationResolvers,
  | "createConnectionGroup"
  | "updateConnectionGroup"
  | "deleteConnectionGroup"
  | "addTraitToGroup"
  | "removeTraitFromGroup"
> = {
  createConnectionGroup: async (_parent, args) => {
    return connectionGroupService.connectionGroup.createConnectionGroup(
      args.input.name,
      args.input.traitIds ?? undefined,
    );
  },
  updateConnectionGroup: async (_parent, args) => {
    return connectionGroupService.connectionGroup.updateConnectionGroup(
      args.id,
      {
        name: args.input.name ?? undefined,
        traitIds: args.input.traitIds ?? undefined,
      },
    );
  },
  deleteConnectionGroup: async (_parent, args) => {
    await connectionGroupService.connectionGroup.deleteConnectionGroup(args.id);
    return true;
  },
  addTraitToGroup: async (_parent, args) => {
    return connectionGroupService.connectionGroup.addTraitToGroup(
      args.groupId,
      args.traitId,
    );
  },
  removeTraitFromGroup: async (_parent, args) => {
    return connectionGroupService.connectionGroup.removeTraitFromGroup(
      args.groupId,
      args.traitId,
    );
  },
};
