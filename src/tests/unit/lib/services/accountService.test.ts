import { describe, expect, it, vi } from "vitest";
import { createMockPrisma } from "@/tests/helpers/mockPrisma";

vi.mock("@/lib/database/prisma", () => ({
  prisma: createMockPrisma({
    account: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    trait: {
      findMany: vi.fn(),
    },
    connection: {
      findMany: vi.fn(),
    },
    connectionGroup: {
      findMany: vi.fn(),
    },
  }),
}));

import { prisma } from "@/lib/database/prisma";
import service from "@/lib/services/accountService";

describe("accountService.account", () => {
  describe("findAccountById", () => {
    it("calls prisma.account.findUnique with correct id", async () => {
      const mockAccount = {
        id: "test-id",
        displayName: "Test",
        username: "test",
      };
      vi.mocked(prisma.account.findUnique).mockResolvedValue(mockAccount);

      const result = await service.account.findAccountById("test-id");

      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
      expect(result).toEqual(mockAccount);
    });

    it("returns null when account not found", async () => {
      vi.mocked(prisma.account.findUnique).mockResolvedValue(null);

      const result = await service.account.findAccountById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("updateAccount", () => {
    it("calls prisma.account.update with id and data", async () => {
      const updated = {
        id: "test-id",
        displayName: "New Name",
        username: "test",
      };
      vi.mocked(prisma.account.update).mockResolvedValue(updated);

      const result = await service.account.updateAccount("test-id", {
        displayName: "New Name",
      });

      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { id: "test-id" },
        data: { displayName: "New Name" },
      });
      expect(result).toEqual(updated);
    });
  });
});

describe("accountService.search", () => {
  describe("findAccountsByUsername", () => {
    it("uses partial case-insensitive search", async () => {
      const mockResults = [{ id: "1", username: "testuser" }];
      vi.mocked(prisma.account.findMany).mockResolvedValue(mockResults);

      const result = await service.search.findAccountsByUsername("test");

      expect(prisma.account.findMany).toHaveBeenCalledWith({
        where: {
          publicListed: true,
          username: {
            contains: "test",
            mode: "default",
          },
        },
      });
      expect(result).toEqual(mockResults);
    });
  });
});
