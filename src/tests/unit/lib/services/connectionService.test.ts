import { describe, expect, it, vi } from "vitest";
import { createMockPrisma } from "@/tests/helpers/mockPrisma";
import type { ConnectionStatus } from "@/generated/prisma/enums";

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(() => Promise.resolve({ user: { id: "acc-1" } })),
    },
  },
}));

vi.mock("@/lib/database/prisma", () => ({
  prisma: createMockPrisma({
    connection: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    connectionSide: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    connectionGroup: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  }),
}));

import { prisma } from "@/lib/database/prisma";
import service from "@/lib/services/connectionService";

function mockConnection(
  overrides: Partial<{
    id: string;
    initiatorId: string;
    recipientId: string;
    status: ConnectionStatus;
    createdAt: Date;
    updatedAt: Date;
  }> = {},
) {
  return {
    id: overrides.id ?? "conn-1",
    initiatorId: overrides.initiatorId ?? "acc-1",
    recipientId: overrides.recipientId ?? "acc-2",
    status: overrides.status ?? ("PENDING" as ConnectionStatus),
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  };
}

function mockSide(
  overrides: Partial<{
    id: string;
    connectionId: string;
    accountId: string;
    groups: string[];
  }> = {},
) {
  return {
    id: overrides.id ?? "side-1",
    connectionId: overrides.connectionId ?? "conn-1",
    accountId: overrides.accountId ?? "acc-1",
    groups: overrides.groups ?? [],
  };
}

describe("connectionService.connection", () => {
  describe("findConnectionById", () => {
    it("calls prisma.connection.findUnique with correct id", async () => {
      const mock = mockConnection();
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(mock);

      const result = await service.connection.findConnectionById("conn-1");

      expect(prisma.connection.findUnique).toHaveBeenCalledWith({
        where: { id: "conn-1" },
      });
      expect(result).toEqual(mock);
    });

    it("returns null when not found", async () => {
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(null);

      const result = await service.connection.findConnectionById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("addConnectionToGroup", () => {
    it("calls prisma.connectionSide.update with connect", async () => {
      const mockConn = mockConnection({ status: "ACCEPTED" });
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(mockConn);
      const mockSideData = mockSide();
      vi.mocked(prisma.connectionSide.findUnique).mockResolvedValue(
        mockSideData,
      );
      const mockGroup = {
        id: "group-1",
        name: "Social",
        accountId: "acc-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.connectionGroup.findUnique).mockResolvedValue(mockGroup);
      const updated = mockSide({ groups: ["group-1"] });
      vi.mocked(prisma.connectionSide.update).mockResolvedValue(updated);

      const result = await service.connection.addConnectionToGroup(
        "conn-1",
        "group-1",
      );

      expect(prisma.connectionSide.update).toHaveBeenCalledWith({
        where: { id: "side-1" },
        data: { groups: { connect: { id: "group-1" } } },
      });
      expect(result).toEqual(updated);
    });
  });

  describe("removeConnectionFromGroup", () => {
    it("calls prisma.connectionSide.update with disconnect", async () => {
      const mockSideData = mockSide();
      vi.mocked(prisma.connectionSide.findUnique).mockResolvedValue(
        mockSideData,
      );
      const mockGroup = {
        id: "group-1",
        name: "Social",
        accountId: "acc-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.connectionGroup.findUnique).mockResolvedValue(mockGroup);
      const updated = mockSide({ groups: [] });
      vi.mocked(prisma.connectionSide.update).mockResolvedValue(updated);

      const result = await service.connection.removeConnectionFromGroup(
        "conn-1",
        "group-1",
      );

      expect(prisma.connectionSide.update).toHaveBeenCalledWith({
        where: { id: "side-1" },
        data: { groups: { disconnect: { id: "group-1" } } },
      });
      expect(result).toEqual(updated);
    });
  });

  describe("updateConnectionTraitGroups", () => {
    it("finds groups by trait ids then updates side", async () => {
      const mockSideData = mockSide();
      vi.mocked(prisma.connectionSide.findUnique).mockResolvedValue(
        mockSideData,
      );
      const mockGroups = [
        {
          id: "group-1",
          name: "Social",
          createdAt: new Date(),
          updatedAt: new Date(),
          accountId: "acc-1",
        },
      ];
      vi.mocked(prisma.connectionGroup.findMany).mockResolvedValue(mockGroups);
      const updated = mockSide();
      vi.mocked(prisma.connectionSide.update).mockResolvedValue(updated);

      const result = await service.connection.updateConnectionTraitGroups(
        "conn-1",
        ["trait-1", "trait-2"],
      );

      expect(prisma.connectionGroup.findMany).toHaveBeenCalledWith({
        where: { traits: { some: { id: { in: ["trait-1", "trait-2"] } } } },
      });
      expect(prisma.connectionSide.update).toHaveBeenCalledWith({
        where: { id: "side-1" },
        data: {
          groups: { set: [{ id: "group-1" }] },
        },
      });
      expect(result).toEqual(updated);
    });
  });
});

describe("connectionService.connectionPair", () => {
  describe("createConnectionPair", () => {
    it("creates a connection and initiator side", async () => {
      const createdConn = mockConnection({
        id: "conn-1",
        initiatorId: "acc-1",
        recipientId: "acc-2",
        status: "PENDING",
      });
      vi.mocked(prisma.connection.create).mockResolvedValue(createdConn);
      vi.mocked(prisma.connectionSide.create).mockResolvedValue(mockSide());

      const result = await service.connectionPair.createConnectionPair("acc-2");

      expect(prisma.connection.create).toHaveBeenCalledWith({
        data: {
          initiatorId: "acc-1",
          recipientId: "acc-2",
          status: "PENDING",
        },
      });
      expect(result).toEqual(createdConn);
    });

    it("connects groups when groupIds provided", async () => {
      const createdConn = mockConnection({
        id: "conn-1",
        initiatorId: "acc-1",
        recipientId: "acc-2",
        status: "PENDING",
      });
      vi.mocked(prisma.connection.create).mockResolvedValue(createdConn);
      vi.mocked(prisma.connectionSide.create).mockResolvedValue(mockSide());

      await service.connectionPair.createConnectionPair("acc-2", [
        "group-1",
        "group-2",
      ]);

      expect(prisma.connectionSide.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            groups: {
              connect: [{ id: "group-1" }, { id: "group-2" }],
            },
          }),
        }),
      );
    });
  });

  describe("acceptConnectionPair", () => {
    it("updates connection to ACCEPTED and creates recipient side", async () => {
      const mockConn = mockConnection({
        id: "conn-1",
        recipientId: "acc-1",
        status: "PENDING",
      });
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(mockConn);
      const accepted = mockConnection({ status: "ACCEPTED" });
      vi.mocked(prisma.connection.update).mockResolvedValue(accepted);
      vi.mocked(prisma.connectionSide.create).mockResolvedValue(mockSide());

      const result =
        await service.connectionPair.acceptConnectionPair("conn-1");

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual(accepted);
    });
  });

  describe("declineConnectionPair", () => {
    it("updates connection to DECLINED", async () => {
      const mockConn = mockConnection({
        id: "conn-1",
        recipientId: "acc-1",
        status: "PENDING",
      });
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(mockConn);
      const declined = mockConnection({ status: "DECLINED" });
      vi.mocked(prisma.connection.update).mockResolvedValue(declined);

      const result =
        await service.connectionPair.declineConnectionPair("conn-1");

      expect(prisma.connection.update).toHaveBeenCalledWith({
        where: { id: "conn-1" },
        data: { status: "DECLINED" },
      });
      expect(result).toEqual(declined);
    });
  });

  describe("deleteConnectionPair", () => {
    it("deletes the connection", async () => {
      const mockConn = mockConnection({
        id: "conn-1",
        initiatorId: "acc-1",
        recipientId: "acc-2",
      });
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(mockConn);
      vi.mocked(prisma.connection.delete).mockResolvedValue(mockConnection());

      await service.connectionPair.deleteConnectionPair("conn-1");

      expect(prisma.connection.delete).toHaveBeenCalledWith({
        where: { id: "conn-1" },
      });
    });
  });
});

describe("connectionService.search", () => {
  describe("findConnectionsByAccountId", () => {
    it("finds connections with status filter", async () => {
      const mockConns = [mockConnection({ status: "ACCEPTED" })];
      vi.mocked(prisma.connection.findMany).mockResolvedValue(mockConns);

      const result =
        await service.search.findConnectionsByAccountId("ACCEPTED");

      expect(prisma.connection.findMany).toHaveBeenCalledWith({
        where: {
          status: "ACCEPTED",
          OR: [{ initiatorId: "acc-1" }, { recipientId: "acc-1" }],
        },
      });
      expect(result).toEqual(mockConns);
    });
  });

  describe("findPendingConnectionsForAccount", () => {
    it("finds pending connections where user is recipient", async () => {
      const mockConns = [mockConnection({ status: "PENDING" })];
      vi.mocked(prisma.connection.findMany).mockResolvedValue(mockConns);

      const result = await service.search.findPendingConnectionsForAccount();

      expect(prisma.connection.findMany).toHaveBeenCalledWith({
        where: { recipientId: "acc-1", status: "PENDING" },
      });
      expect(result).toEqual(mockConns);
    });
  });

  describe("findConnectionBetweenAccounts", () => {
    it("finds connection between two accounts", async () => {
      const mockConn = mockConnection({
        initiatorId: "acc-1",
        recipientId: "acc-2",
      });
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(mockConn);

      const result =
        await service.search.findConnectionBetweenAccounts("acc-2");

      expect(prisma.connection.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { initiatorId: "acc-1", recipientId: "acc-2" },
            { initiatorId: "acc-2", recipientId: "acc-1" },
          ],
        },
      });
      expect(result).toEqual(mockConn);
    });
  });

  describe("checkConnectionExists", () => {
    it("checks both directions with OR", async () => {
      const mockConn = mockConnection();
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(mockConn);

      const result = await service.search.checkConnectionExists("acc-2");

      expect(prisma.connection.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { initiatorId: "acc-1", recipientId: "acc-2" },
            { initiatorId: "acc-2", recipientId: "acc-1" },
          ],
        },
      });
      expect(result).toEqual(mockConn);
    });
  });

  describe("findGroupsForSide", () => {
    it("finds groups containing the side", async () => {
      const mockGroups = [
        {
          id: "group-1",
          name: "Social",
          createdAt: new Date(),
          updatedAt: new Date(),
          accountId: "acc-1",
        },
      ];
      vi.mocked(prisma.connectionGroup.findMany).mockResolvedValue(mockGroups);

      const result = await service.search.findGroupsForSide("side-1");

      expect(prisma.connectionGroup.findMany).toHaveBeenCalledWith({
        where: { sides: { some: { id: "side-1" } } },
      });
      expect(result).toEqual(mockGroups);
    });
  });

  describe("findSidesForConnection", () => {
    it("finds sides for a connection", async () => {
      const mockSides = [mockSide()];
      vi.mocked(prisma.connectionSide.findMany).mockResolvedValue(mockSides);

      const result = await service.search.findSidesForConnection("conn-1");

      expect(prisma.connectionSide.findMany).toHaveBeenCalledWith({
        where: { connectionId: "conn-1" },
      });
      expect(result).toEqual(mockSides);
    });
  });

  describe("findUserById", () => {
    it("finds user by id", async () => {
      const mockUser = {
        id: "acc-1",
        name: "Test Name",
        email: "test@example.com",
        emailVerified: true,
        image: null,
        displayName: "Test",
        username: "test",
        displayUsername: null,
        publicListed: true,
        role: "user",
        banned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await service.search.findUserById("acc-1");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "acc-1" },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
