import { describe, expect, it, vi } from "vitest";
import { createMockPrisma } from "@/tests/helpers/mockPrisma";
import type { TraitCategory } from "@/generated/prisma/enums";

vi.mock("@/lib/database/prisma", () => ({
  prisma: createMockPrisma({
    trait: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    connectionGroup: {
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  }),
}));

import { prisma } from "@/lib/database/prisma";
import service from "@/lib/services/traitService";

describe("traitService.trait", () => {
  describe("findTraitById", () => {
    it("calls prisma.trait.findUnique with correct id", async () => {
      const mockTrait = {
        id: "trait-1",
        key: "twitter",
        value: "@user",
        category: "SOCIAL_LINK" as TraitCategory,
        icon: "twitter-icon",
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: "acc-1",
      };
      vi.mocked(prisma.trait.findUnique).mockResolvedValue(mockTrait);

      const result = await service.trait.findTraitById("trait-1");

      expect(prisma.trait.findUnique).toHaveBeenCalledWith({
        where: { id: "trait-1" },
      });
      expect(result).toEqual(mockTrait);
    });

    it("returns null when trait not found", async () => {
      vi.mocked(prisma.trait.findUnique).mockResolvedValue(null);

      const result = await service.trait.findTraitById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("createTrait", () => {
    it("calls prisma.trait.create with data and accountId", async () => {
      const mockTrait = {
        id: "trait-1",
        key: "email",
        value: "user@example.com",
        category: "EMAIL" as TraitCategory,
        icon: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: "acc-1",
      };
      vi.mocked(prisma.trait.create).mockResolvedValue(mockTrait);

      const result = await service.trait.createTrait(
        {
          key: "email",
          value: "user@example.com",
          category: "EMAIL",
        },
        "acc-1",
      );

      expect(prisma.trait.create).toHaveBeenCalledWith({
        data: {
          key: "email",
          value: "user@example.com",
          category: "EMAIL",
          accountId: "acc-1",
        },
      });
      expect(result).toEqual(mockTrait);
    });

    it("includes optional icon when provided", async () => {
      const mockTrait = {
        id: "trait-1",
        key: "github",
        value: "https://github.com/user",
        category: "WEBSITE_LINK" as TraitCategory,
        icon: "github-icon",
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: "acc-1",
      };
      vi.mocked(prisma.trait.create).mockResolvedValue(mockTrait);

      await service.trait.createTrait(
        {
          key: "github",
          value: "https://github.com/user",
          category: "WEBSITE_LINK",
          icon: "github-icon",
        },
        "acc-1",
      );

      expect(prisma.trait.create).toHaveBeenCalledWith({
        data: {
          key: "github",
          value: "https://github.com/user",
          category: "WEBSITE_LINK",
          icon: "github-icon",
          accountId: "acc-1",
        },
      });
    });
  });

  describe("updateTrait", () => {
    it("calls prisma.trait.update with id and data", async () => {
      const updated = {
        id: "trait-1",
        key: "new-key",
        value: "new-value",
        category: "CONTACT_INFO" as TraitCategory,
        icon: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: "acc-1",
      };
      vi.mocked(prisma.trait.update).mockResolvedValue(updated);

      const result = await service.trait.updateTrait("trait-1", {
        key: "new-key",
        value: "new-value",
        category: "CONTACT_INFO",
      });

      expect(prisma.trait.update).toHaveBeenCalledWith({
        where: { id: "trait-1" },
        data: {
          key: "new-key",
          value: "new-value",
          category: "CONTACT_INFO",
        },
      });
      expect(result).toEqual(updated);
    });
  });

  describe("deleteTrait", () => {
    it("calls prisma.trait.delete with id", async () => {
      const deleted = {
        id: "trait-1",
        key: "twitter",
        value: "@user",
        category: "SOCIAL_LINK" as TraitCategory,
        icon: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: "acc-1",
      };
      vi.mocked(prisma.trait.delete).mockResolvedValue(deleted);

      const result = await service.trait.deleteTrait("trait-1");

      expect(prisma.trait.delete).toHaveBeenCalledWith({
        where: { id: "trait-1" },
      });
      expect(result).toEqual(deleted);
    });
  });
});

describe("traitService.search", () => {
  describe("findTraitsByAccountId", () => {
    it("calls prisma.trait.findMany with accountId", async () => {
      const mockTraits = [
        {
          id: "trait-1",
          key: "twitter",
          value: "@user",
          category: "SOCIAL_LINK" as TraitCategory,
          icon: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          accountId: "acc-1",
        },
      ];
      vi.mocked(prisma.trait.findMany).mockResolvedValue(mockTraits);

      const result = await service.search.findTraitsByAccountId("acc-1");

      expect(prisma.trait.findMany).toHaveBeenCalledWith({
        where: { accountId: "acc-1" },
      });
      expect(result).toEqual(mockTraits);
    });
  });

  describe("findVisibleGroupsForTrait", () => {
    it("calls prisma.connectionGroup.findMany with trait filter", async () => {
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

      const result = await service.search.findVisibleGroupsForTrait("trait-1");

      expect(prisma.connectionGroup.findMany).toHaveBeenCalledWith({
        where: { traits: { some: { id: "trait-1" } } },
      });
      expect(result).toEqual(mockGroups);
    });
  });

  describe("findAccountForTrait", () => {
    it("calls prisma.user.findUnique with accountId", async () => {
      const mockUser = {
        id: "acc-1",
        name: "Test Name",
        email: "test@example.com",
        emailVerified: true,
        image: null,
        displayName: "Test User",
        username: "testuser",
        publicListed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await service.search.findAccountForTrait("acc-1");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "acc-1" },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
