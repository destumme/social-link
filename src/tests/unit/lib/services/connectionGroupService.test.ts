import { describe, expect, it, vi } from "vitest";
import { createMockPrisma } from "@/tests/helpers/mockPrisma";

vi.mock("@/lib/database/prisma", () => ({
  prisma: createMockPrisma({
    connectionGroup: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    connection: {
      findMany: vi.fn(),
    },
    trait: {
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  }),
}));

import { prisma } from "@/lib/database/prisma";
import service from "@/lib/services/connectionGroupService";
import { ConnectionStatus, TraitCategory } from "@/generated/prisma/enums";

function mockConnectionGroup(
  overrides: Partial<{
    id: string;
    name: string;
    accountId: string;
    createdAt: Date;
    updatedAt: Date;
  }> = {},
) {
  return {
    id: overrides.id ?? "group-1",
    name: overrides.name ?? "Social",
    accountId: overrides.accountId ?? "acc-1",
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  };
}

describe("connectionGroupService.connectionGroup", () => {
  describe("findConnectionGroupById", () => {
    it("calls prisma.connectionGroup.findUnique with correct id", async () => {
      const mock = mockConnectionGroup();
      vi.mocked(prisma.connectionGroup.findUnique).mockResolvedValue(mock);

      const result =
        await service.connectionGroup.findConnectionGroupById("group-1");

      expect(prisma.connectionGroup.findUnique).toHaveBeenCalledWith({
        where: { id: "group-1" },
      });
      expect(result).toEqual(mock);
    });

    it("returns null when not found", async () => {
      vi.mocked(prisma.connectionGroup.findUnique).mockResolvedValue(null);

      const result =
        await service.connectionGroup.findConnectionGroupById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("createConnectionGroup", () => {
    it("creates group without traits when traitIds not provided", async () => {
      const mock = mockConnectionGroup();
      vi.mocked(prisma.connectionGroup.create).mockResolvedValue(mock);

      const result = await service.connectionGroup.createConnectionGroup(
        "Social",
        "acc-1",
      );

      expect(prisma.connectionGroup.create).toHaveBeenCalledWith({
        data: {
          name: "Social",
          accountId: "acc-1",
        },
      });
      expect(result).toEqual(mock);
    });

    it("creates group with connected traits when traitIds provided", async () => {
      const mock = mockConnectionGroup();
      vi.mocked(prisma.connectionGroup.create).mockResolvedValue(mock);

      const result = await service.connectionGroup.createConnectionGroup(
        "Social",
        "acc-1",
        ["trait-1", "trait-2"],
      );

      expect(prisma.connectionGroup.create).toHaveBeenCalledWith({
        data: {
          name: "Social",
          accountId: "acc-1",
          traits: { connect: [{ id: "trait-1" }, { id: "trait-2" }] },
        },
      });
      expect(result).toEqual(mock);
    });
  });

  describe("updateConnectionGroup", () => {
    it("updates name only when traitIds not provided", async () => {
      const updated = mockConnectionGroup({ name: "Updated" });
      vi.mocked(prisma.connectionGroup.update).mockResolvedValue(updated);

      const result = await service.connectionGroup.updateConnectionGroup(
        "group-1",
        { name: "Updated" },
      );

      expect(prisma.connectionGroup.update).toHaveBeenCalledWith({
        where: { id: "group-1" },
        data: { name: "Updated" },
      });
      expect(result).toEqual(updated);
    });

    it("updates name and sets traits when traitIds provided", async () => {
      const updated = mockConnectionGroup({ name: "Updated" });
      vi.mocked(prisma.connectionGroup.update).mockResolvedValue(updated);

      const result = await service.connectionGroup.updateConnectionGroup(
        "group-1",
        { name: "Updated", traitIds: ["trait-1"] },
      );

      expect(prisma.connectionGroup.update).toHaveBeenCalledWith({
        where: { id: "group-1" },
        data: {
          name: "Updated",
          traits: { set: [{ id: "trait-1" }] },
        },
      });
      expect(result).toEqual(updated);
    });
  });

  describe("deleteConnectionGroup", () => {
    it("calls prisma.connectionGroup.delete with id", async () => {
      const deleted = mockConnectionGroup();
      vi.mocked(prisma.connectionGroup.delete).mockResolvedValue(deleted);

      const result =
        await service.connectionGroup.deleteConnectionGroup("group-1");

      expect(prisma.connectionGroup.delete).toHaveBeenCalledWith({
        where: { id: "group-1" },
      });
      expect(result).toEqual(deleted);
    });
  });

  describe("addTraitToGroup", () => {
    it("connects trait to group", async () => {
      const updated = mockConnectionGroup();
      vi.mocked(prisma.connectionGroup.update).mockResolvedValue(updated);

      const result = await service.connectionGroup.addTraitToGroup(
        "group-1",
        "trait-1",
      );

      expect(prisma.connectionGroup.update).toHaveBeenCalledWith({
        where: { id: "group-1" },
        data: { traits: { connect: { id: "trait-1" } } },
      });
      expect(result).toEqual(updated);
    });
  });

  describe("removeTraitFromGroup", () => {
    it("disconnects trait from group and includes traits", async () => {
      const updated = {
        ...mockConnectionGroup(),
        traits: [],
      };
      vi.mocked(prisma.connectionGroup.update).mockResolvedValue(updated);

      const result = await service.connectionGroup.removeTraitFromGroup(
        "group-1",
        "trait-1",
      );

      expect(prisma.connectionGroup.update).toHaveBeenCalledWith({
        where: { id: "group-1" },
        data: { traits: { disconnect: [{ id: "trait-1" }] } },
        include: { traits: true },
      });
      expect(result).toEqual(updated);
    });
  });
});

describe("connectionGroupService.search", () => {
  describe("findConnectionGroupsByAccountId", () => {
    it("finds groups by accountId", async () => {
      const mockGroups = [mockConnectionGroup()];
      vi.mocked(prisma.connectionGroup.findMany).mockResolvedValue(mockGroups);

      const result =
        await service.search.findConnectionGroupsByAccountId("acc-1");

      expect(prisma.connectionGroup.findMany).toHaveBeenCalledWith({
        where: { accountId: "acc-1" },
      });
      expect(result).toEqual(mockGroups);
    });
  });

  describe("findAccountForGroup", () => {
    it("finds account by id", async () => {
      const mockUser = {
        id: "acc-1",
        name: "Test Name",
        email: "test@example.com",
        emailVerified: true,
        image: null,
        displayName: "Test",
        username: "test",
        publicListed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await service.search.findAccountForGroup("acc-1");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "acc-1" },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("findConnectionsForGroup", () => {
    it("finds connections in the group", async () => {
      const mockConns = [
        {
          id: "conn-1",
          accountId: "acc-1",
          connectedAccountId: "acc-2",
          status: ConnectionStatus.ACCEPTED,
          groups: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          traits: [],
        },
      ];
      vi.mocked(prisma.connection.findMany).mockResolvedValue(mockConns);

      const result = await service.search.findConnectionsForGroup("group-1");

      expect(prisma.connection.findMany).toHaveBeenCalledWith({
        where: { connectionGroups: { some: { id: "group-1" } } },
      });
      expect(result).toEqual(mockConns);
    });
  });

  describe("findTraitsForGroup", () => {
    it("finds traits visible in the group", async () => {
      const mockTraits = [
        {
          id: "trait-1",
          key: "twitter",
          value: "@user",
          category: TraitCategory.SOCIAL_LINK,
          icon: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          accountId: "acc-1",
        },
      ];
      vi.mocked(prisma.trait.findMany).mockResolvedValue(mockTraits);

      const result = await service.search.findTraitsForGroup("group-1");

      expect(prisma.trait.findMany).toHaveBeenCalledWith({
        where: { visibleGroups: { some: { id: "group-1" } } },
      });
      expect(result).toEqual(mockTraits);
    });
  });
});
