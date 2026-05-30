import { describe, expect, it, vi } from "vitest";
import { createMockPrisma } from "@/tests/helpers/mockPrisma";

vi.mock("@/lib/database/prisma", () => ({
  prisma: createMockPrisma({
    user: {
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
import service from "@/lib/services/userService";

describe("userService.user", () => {
  describe("findUserById", () => {
    it("calls prisma.user.findUnique with correct id", async () => {
      const mockUser = {
        id: "test-id",
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

      const result = await service.user.findUserById("test-id");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
      expect(result).toEqual(mockUser);
    });

    it("returns null when user not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await service.user.findUserById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("calls prisma.user.update with id and data", async () => {
      const updated = {
        id: "test-id",
        name: "New Name",
        email: "test@example.com",
        emailVerified: true,
        image: null,
        displayName: "New Name",
        username: "test",
        publicListed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.update).mockResolvedValue(updated);

      const result = await service.user.updateUser("test-id", {
        displayName: "New Name",
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "test-id" },
        data: { displayName: "New Name" },
      });
      expect(result).toEqual(updated);
    });
  });
});

describe("userService.search", () => {
  describe("findUsersByUsername", () => {
    it("uses partial case-insensitive search", async () => {
      const mockResults = [
        {
          id: "1",
          name: "Test Name",
          email: "test@example.com",
          emailVerified: true,
          image: null,
          username: "testuser",
          displayName: "Test User",
          publicListed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      vi.mocked(prisma.user.findMany).mockResolvedValue(mockResults);

      const result = await service.search.findUsersByUsername("test");

      expect(prisma.user.findMany).toHaveBeenCalledWith({
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
