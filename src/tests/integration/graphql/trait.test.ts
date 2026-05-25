import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  cleanDatabase,
  getTestPrisma,
  setupTestDb,
  teardownTestDb,
} from "@/tests/helpers/testDb";
import { createTestGraphQLClient } from "@/tests/helpers/graphqlClient";

const MY_TRAITS_QUERY = `
  query {
    myTraits {
      id
      key
      value
      category
      icon
    }
  }
`;

const TRAIT_BY_ID_QUERY = `
  query($id: ID!) {
    traitById(id: $id) {
      id
      key
      value
      category
      icon
    }
  }
`;

const CREATE_TRAIT_MUTATION = `
  mutation($input: CreateTraitInput!) {
    createTrait(input: $input) {
      id
      key
      value
      category
      icon
    }
  }
`;

const UPDATE_TRAIT_MUTATION = `
  mutation($id: ID!, $input: UpdateTraitInput!) {
    updateTrait(id: $id, input: $input) {
      id
      key
      value
      category
      icon
    }
  }
`;

const DELETE_TRAIT_MUTATION = `
  mutation($id: ID!) {
    deleteTrait(id: $id)
  }
`;

describe("GraphQL Trait", () => {
  let client: ReturnType<typeof createTestGraphQLClient>;
  let accountId: string;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await cleanDatabase();
    const prisma = getTestPrisma();
    const account = await prisma.account.create({
      data: {
        displayName: "Test User",
        username: `testuser-${Date.now()}`,
      },
    });
    accountId = account.id;
    client = createTestGraphQLClient(accountId);
  });

  describe("myTraits", () => {
    it("returns traits owned by the authenticated account", async () => {
      const prisma = getTestPrisma();
      await prisma.trait.create({
        data: {
          key: "email",
          value: "test@example.com",
          category: "EMAIL",
          accountId,
        },
      });

      const result = await client.query(MY_TRAITS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.myTraits).toHaveLength(1);
      expect(result.data?.myTraits[0].key).toBe("email");
      expect(result.data?.myTraits[0].value).toBe("test@example.com");
      expect(result.data?.myTraits[0].category).toBe("EMAIL");
    });

    it("returns empty array when no traits exist", async () => {
      const result = await client.query(MY_TRAITS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.myTraits).toEqual([]);
    });

    it("does not return traits from other accounts", async () => {
      const prisma = getTestPrisma();
      const otherAccount = await prisma.account.create({
        data: {
          displayName: "Other",
          username: `other-${Date.now()}`,
        },
      });
      await prisma.trait.create({
        data: {
          key: "twitter",
          value: "@other",
          category: "SOCIAL_MEDIA_LINK",
          accountId: otherAccount.id,
        },
      });

      const result = await client.query(MY_TRAITS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.myTraits).toEqual([]);
    });
  });

  describe("traitById", () => {
    it("returns a trait by its id", async () => {
      const prisma = getTestPrisma();
      const trait = await prisma.trait.create({
        data: {
          key: "phone",
          value: "+1234567890",
          category: "PHONE_NUMBER",
          accountId,
        },
      });

      const result = await client.query(TRAIT_BY_ID_QUERY, { id: trait.id });

      expect(result.error).toBeUndefined();
      expect(result.data?.traitById).not.toBeNull();
      expect(result.data?.traitById.key).toBe("phone");
      expect(result.data?.traitById.value).toBe("+1234567890");
    });

    it("returns null for non-existent trait", async () => {
      const result = await client.query(TRAIT_BY_ID_QUERY, {
        id: "nonexistent-id",
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.traitById).toBeNull();
    });
  });

  describe("createTrait", () => {
    it("creates a trait with required fields", async () => {
      const result = await client.mutation(CREATE_TRAIT_MUTATION, {
        input: {
          key: "email",
          value: "new@example.com",
          category: "EMAIL",
        },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.createTrait.id).toBeDefined();
      expect(result.data?.createTrait.key).toBe("email");
      expect(result.data?.createTrait.value).toBe("new@example.com");
      expect(result.data?.createTrait.category).toBe("EMAIL");
    });

    it("creates a trait with optional icon", async () => {
      const result = await client.mutation(CREATE_TRAIT_MUTATION, {
        input: {
          key: "github",
          value: "https://github.com/user",
          category: "WEBSITE_LINK",
          icon: "github-icon",
        },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.createTrait.icon).toBe("github-icon");
    });

    it("associates trait with authenticated account", async () => {
      await client.mutation(CREATE_TRAIT_MUTATION, {
        input: {
          key: "twitter",
          value: "@testuser",
          category: "SOCIAL_MEDIA_LINK",
        },
      });

      const prisma = getTestPrisma();
      const traits = await prisma.trait.findMany({ where: { accountId } });

      expect(traits).toHaveLength(1);
      expect(traits[0].key).toBe("twitter");
    });
  });

  describe("updateTrait", () => {
    it("updates trait fields", async () => {
      const prisma = getTestPrisma();
      const trait = await prisma.trait.create({
        data: {
          key: "email",
          value: "old@example.com",
          category: "EMAIL",
          accountId,
        },
      });

      const result = await client.mutation(UPDATE_TRAIT_MUTATION, {
        id: trait.id,
        input: { value: "new@example.com" },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateTrait.value).toBe("new@example.com");
    });

    it("updates category", async () => {
      const prisma = getTestPrisma();
      const trait = await prisma.trait.create({
        data: {
          key: "link",
          value: "https://example.com",
          category: "WEBSITE_LINK",
          accountId,
        },
      });

      const result = await client.mutation(UPDATE_TRAIT_MUTATION, {
        id: trait.id,
        input: { category: "SOCIAL_MEDIA_LINK" },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateTrait.category).toBe("SOCIAL_MEDIA_LINK");
    });
  });

  describe("deleteTrait", () => {
    it("deletes a trait and returns true", async () => {
      const prisma = getTestPrisma();
      const trait = await prisma.trait.create({
        data: {
          key: "email",
          value: "test@example.com",
          category: "EMAIL",
          accountId,
        },
      });

      const result = await client.mutation(DELETE_TRAIT_MUTATION, {
        id: trait.id,
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.deleteTrait).toBe(true);

      const deleted = await prisma.trait.findUnique({
        where: { id: trait.id },
      });
      expect(deleted).toBeNull();
    });

    it("throws error for non-existent trait", async () => {
      const result = await client.mutation(DELETE_TRAIT_MUTATION, {
        id: "nonexistent-id",
      });

      expect(result.error).toBeDefined();
    });
  });
});
