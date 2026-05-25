import { describe, expect, it, vi } from "vitest";
import { createMockPrisma } from "@/tests/helpers/mockPrisma";
import type { ConnectionStatus } from "@/generated/prisma/enums";

vi.mock("@/lib/database/prisma", () => ({
  prisma: createMockPrisma({
    connection: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      createManyAndReturn: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    connectionGroup: {
      findMany: vi.fn(),
    },
    account: {
      findUnique: vi.fn(),
    },
  }),
}));

import { prisma } from "@/lib/database/prisma";
import service from "@/lib/services/connectionService";

function mockConnection(
  overrides: Partial<{
    id: string;
    accountId: string;
    connectedAccountId: string;
    status: ConnectionStatus;
    groups: string[];
    createdAt: Date;
    updatedAt: Date;
  }> = {},
) {
  return {
    id: overrides.id ?? "conn-1",
    accountId: overrides.accountId ?? "acc-1",
    connectedAccountId: overrides.connectedAccountId ?? "acc-2",
    status: overrides.status ?? ("PENDING" as ConnectionStatus),
    groups: overrides.groups ?? [],
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
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
    it("calls prisma.connection.update with connect", async () => {
      const updated = mockConnection({ groups: ["group-1"] });
      vi.mocked(prisma.connection.update).mockResolvedValue(updated);

      const result = await service.connection.addConnectionToGroup(
        "conn-1",
        "group-1",
      );

      expect(prisma.connection.update).toHaveBeenCalledWith({
        where: { id: "conn-1" },
        data: { connectionGroups: { connect: { id: "group-1" } } },
      });
      expect(result).toEqual(updated);
    });
  });

  describe("removeConnectionFromGroup", () => {
    it("calls prisma.connection.update with disconnect", async () => {
      const updated = mockConnection({ groups: [] });
      vi.mocked(prisma.connection.update).mockResolvedValue(updated);

      const result = await service.connection.removeConnectionFromGroup(
        "conn-1",
        "group-1",
      );

      expect(prisma.connection.update).toHaveBeenCalledWith({
        where: { id: "conn-1" },
        data: { connectionGroups: { disconnect: { id: "group-1" } } },
      });
      expect(result).toEqual(updated);
    });
  });

  describe("updateConnectionTraitGroups", () => {
    it("finds groups by trait ids then updates connection", async () => {
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
      const updated = mockConnection();
      vi.mocked(prisma.connection.update).mockResolvedValue(updated);

      const result = await service.connection.updateConnectionTraitGroups(
        "conn-1",
        ["trait-1", "trait-2"],
      );

      expect(prisma.connectionGroup.findMany).toHaveBeenCalledWith({
        where: { traits: { some: { id: { in: ["trait-1", "trait-2"] } } } },
      });
      expect(prisma.connection.update).toHaveBeenCalledWith({
        where: { id: "conn-1" },
        data: {
          connectionGroups: { set: [{ id: "group-1" }] },
        },
      });
      expect(result).toEqual(updated);
    });
  });
});

describe("connectionService.connectionPair", () => {
  describe("findConnectionPair", () => {
    it("returns connection and otherSide when both exist", async () => {
      const conn = mockConnection({
        id: "conn-1",
        accountId: "acc-1",
        connectedAccountId: "acc-2",
      });
      const other = mockConnection({
        id: "conn-2",
        accountId: "acc-2",
        connectedAccountId: "acc-1",
      });
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(conn);
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(other);

      const result = await service.connectionPair.findConnectionPair("conn-1");

      expect(result).toEqual({ connection: conn, otherSide: other });
    });

    it("returns null when connection not found", async () => {
      vi.mocked(prisma.connection.findUnique).mockResolvedValue(null);

      const result =
        await service.connectionPair.findConnectionPair("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("createConnectionPair", () => {
    it("creates two connections and returns the from side", async () => {
      const fromConn = mockConnection({
        id: "conn-1",
        accountId: "acc-1",
        connectedAccountId: "acc-2",
        status: "PENDING",
      });
      const toConn = mockConnection({
        id: "conn-2",
        accountId: "acc-2",
        connectedAccountId: "acc-1",
        status: "PENDING",
      });
      vi.mocked(prisma.connection.createManyAndReturn).mockResolvedValue([
        fromConn,
        toConn,
      ]);

      const result = await service.connectionPair.createConnectionPair(
        "acc-1",
        "acc-2",
      );

      expect(prisma.connection.createManyAndReturn).toHaveBeenCalledWith({
        data: [
          {
            accountId: "acc-1",
            connectedAccountId: "acc-2",
            status: "PENDING",
          },
          {
            accountId: "acc-2",
            connectedAccountId: "acc-1",
            status: "PENDING",
          },
        ],
      });
      expect(result).toEqual(fromConn);
    });

    it("connects groups when groupIds provided", async () => {
      const fromConn = mockConnection({
        id: "conn-1",
        accountId: "acc-1",
        connectedAccountId: "acc-2",
        status: "PENDING",
      });
      const toConn = mockConnection({
        id: "conn-2",
        accountId: "acc-2",
        connectedAccountId: "acc-1",
        status: "PENDING",
      });
      vi.mocked(prisma.connection.createManyAndReturn).mockResolvedValue([
        fromConn,
        toConn,
      ]);

      await service.connectionPair.createConnectionPair("acc-1", "acc-2", [
        "group-1",
        "group-2",
      ]);

      expect(prisma.connection.createManyAndReturn).toHaveBeenCalledWith({
        data: [
          {
            accountId: "acc-1",
            connectedAccountId: "acc-2",
            status: "PENDING",
            connectionGroups: {
              connect: [{ id: "group-1" }, { id: "group-2" }],
            },
          },
          {
            accountId: "acc-2",
            connectedAccountId: "acc-1",
            status: "PENDING",
          },
        ],
      });
    });
  });

  describe("acceptConnectionPair", () => {
    it("updates both connections to ACCEPTED", async () => {
      const accepted = mockConnection({ status: "ACCEPTED" });
      vi.mocked(prisma.connection.update).mockResolvedValue(accepted);

      const result = await service.connectionPair.acceptConnectionPair(
        "conn-1",
        "conn-2",
      );

      expect(prisma.$transaction).toHaveBeenCalledWith([
        expect.objectContaining({}),
        expect.objectContaining({}),
      ]);
      expect(result).toEqual(accepted);
    });
  });

  describe("declineConnectionPair", () => {
    it("updates both connections to DECLINED", async () => {
      const declined = mockConnection({ status: "DECLINED" });
      vi.mocked(prisma.connection.update).mockResolvedValue(declined);

      const result = await service.connectionPair.declineConnectionPair(
        "conn-1",
        "conn-2",
      );

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual(declined);
    });
  });

  describe("deleteConnectionPair", () => {
    it("deletes both connections via transaction", async () => {
      vi.mocked(prisma.connection.delete).mockResolvedValue(mockConnection());
      vi.mocked(prisma.connection.deleteMany).mockResolvedValue({ count: 1 });

      await service.connectionPair.deleteConnectionPair(
        "conn-1",
        "acc-2",
        "acc-1",
      );

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.connection.delete).toHaveBeenCalledWith({
        where: { id: "conn-1" },
      });
      expect(prisma.connection.deleteMany).toHaveBeenCalledWith({
        where: { accountId: "acc-2", connectedAccountId: "acc-1" },
      });
    });
  });
});

describe("connectionService.search", () => {
  describe("findConnectionsByAccountId", () => {
    it("finds connections without status filter when status is null", async () => {
      const mockConns = [mockConnection()];
      vi.mocked(prisma.connection.findMany).mockResolvedValue(mockConns);

      const result = await service.search.findConnectionsByAccountId(
        "acc-1",
        null,
      );

      expect(prisma.connection.findMany).toHaveBeenCalledWith({
        where: { accountId: "acc-1" },
      });
      expect(result).toEqual(mockConns);
    });

    it("finds connections with status filter when status provided", async () => {
      const mockConns = [mockConnection({ status: "PENDING" })];
      vi.mocked(prisma.connection.findMany).mockResolvedValue(mockConns);

      const result = await service.search.findConnectionsByAccountId(
        "acc-1",
        "PENDING",
      );

      expect(prisma.connection.findMany).toHaveBeenCalledWith({
        where: { accountId: "acc-1", status: "PENDING" },
      });
      expect(result).toEqual(mockConns);
    });
  });

  describe("findPendingConnectionsForAccount", () => {
    it("finds pending connections by connectedAccountId", async () => {
      const mockConns = [mockConnection({ status: "PENDING" })];
      vi.mocked(prisma.connection.findMany).mockResolvedValue(mockConns);

      const result =
        await service.search.findPendingConnectionsForAccount("acc-2");

      expect(prisma.connection.findMany).toHaveBeenCalledWith({
        where: { connectedAccountId: "acc-2", status: "PENDING" },
      });
      expect(result).toEqual(mockConns);
    });
  });

  describe("findConnectionBetweenAccounts", () => {
    it("finds first connection between two accounts", async () => {
      const mockConn = mockConnection({
        accountId: "acc-1",
        connectedAccountId: "acc-2",
      });
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(mockConn);

      const result = await service.search.findConnectionBetweenAccounts(
        "acc-1",
        "acc-2",
      );

      expect(prisma.connection.findFirst).toHaveBeenCalledWith({
        where: { accountId: "acc-1", connectedAccountId: "acc-2" },
      });
      expect(result).toEqual(mockConn);
    });
  });

  describe("checkConnectionExists", () => {
    it("checks both directions with OR", async () => {
      const mockConn = mockConnection();
      vi.mocked(prisma.connection.findFirst).mockResolvedValue(mockConn);

      const result = await service.search.checkConnectionExists(
        "acc-1",
        "acc-2",
      );

      expect(prisma.connection.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { accountId: "acc-1", connectedAccountId: "acc-2" },
            { accountId: "acc-2", connectedAccountId: "acc-1" },
          ],
        },
      });
      expect(result).toEqual(mockConn);
    });
  });

  describe("findGroupsForConnection", () => {
    it("finds groups containing the connection", async () => {
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

      const result = await service.search.findGroupsForConnection("conn-1");

      expect(prisma.connectionGroup.findMany).toHaveBeenCalledWith({
        where: { connections: { some: { id: "conn-1" } } },
      });
      expect(result).toEqual(mockGroups);
    });
  });

  describe("findAccountForConnection", () => {
    it("finds account by id", async () => {
      const mockAccount = {
        id: "acc-1",
        displayName: "Test",
        username: "test",
        publicListed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.account.findUnique).mockResolvedValue(mockAccount);

      const result = await service.search.findAccountForConnection("acc-1");

      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { id: "acc-1" },
      });
      expect(result).toEqual(mockAccount);
    });
  });

  describe("findConnectedAccountForConnection", () => {
    it("finds connected account by id", async () => {
      const mockAccount = {
        id: "acc-2",
        displayName: "Other",
        username: "other",
        publicListed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.account.findUnique).mockResolvedValue(mockAccount);

      const result =
        await service.search.findConnectedAccountForConnection("acc-2");

      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { id: "acc-2" },
      });
      expect(result).toEqual(mockAccount);
    });
  });
});
