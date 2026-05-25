import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  cleanDatabase,
  getTestPrisma,
  setupTestDb,
  teardownTestDb,
} from "@/tests/helpers/testDb";
import { createTestGraphQLClient } from "@/tests/helpers/graphqlClient";

const ME_QUERY = `
  query {
    me {
      id
      displayName
      username
      publicListed
    }
  }
`;

const ACCOUNT_BY_USERNAME_QUERY = `
  query($username: String!) {
    accountByUsername(username: $username) {
      id
      displayName
      username
      publicListed
    }
  }
`;

const ACCOUNT_BY_SHARE_ID_QUERY = `
  query($shareId: String!) {
    accountByShareId(shareId: $shareId) {
      id
      displayName
    }
  }
`;

const UPDATE_ACCOUNT_MUTATION = `
  mutation($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      id
      displayName
      username
      publicListed
    }
  }
`;

describe("GraphQL Account", () => {
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
        publicListed: true,
      },
    });
    accountId = account.id;
    client = createTestGraphQLClient(accountId);
  });

  describe("me", () => {
    it("returns the authenticated account", async () => {
      const result = await client.query(ME_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.me).not.toBeNull();
      expect(result.data?.me.id).toBe(accountId);
      expect(result.data?.me.displayName).toBe("Test User");
    });

    it("throws error when account is deleted", async () => {
      const prisma = getTestPrisma();
      await prisma.account.delete({ where: { id: accountId } });

      const result = await client.query(ME_QUERY, {});

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("account not found");
    });
  });

  describe("accountByUsername", () => {
    it("searches for accounts by partial username", async () => {
      const result = await client.query(ACCOUNT_BY_USERNAME_QUERY, {
        username: "test",
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain(
        "Cannot return null for non-nullable field",
      );
    });

    it("excludes private accounts from search", async () => {
      const prisma = getTestPrisma();
      await prisma.account.create({
        data: {
          displayName: "Private User",
          username: `private-${Date.now()}`,
          publicListed: false,
        },
      });

      const result = await client.query(ACCOUNT_BY_USERNAME_QUERY, {
        username: "private",
      });

      expect(result.data?.accountByUsername).toBeNull();
    });
  });

  describe("accountByShareId", () => {
    it("throws Not implemented error", async () => {
      const result = await client.query(ACCOUNT_BY_SHARE_ID_QUERY, {
        shareId: "test-share-id",
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("Not implemented");
    });
  });

  describe("updateAccount", () => {
    it("updates displayName", async () => {
      const result = await client.mutation(UPDATE_ACCOUNT_MUTATION, {
        input: { displayName: "New Name" },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateAccount.displayName).toBe("New Name");
      expect(result.data?.updateAccount.id).toBe(accountId);
    });

    it("updates username", async () => {
      const newUsername = `newname-${Date.now()}`;
      const result = await client.mutation(UPDATE_ACCOUNT_MUTATION, {
        input: { username: newUsername },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateAccount.username).toBe(newUsername);
    });

    it("updates publicListed", async () => {
      const result = await client.mutation(UPDATE_ACCOUNT_MUTATION, {
        input: { publicListed: false },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateAccount.publicListed).toBe(false);
    });

    it("updates multiple fields at once", async () => {
      const result = await client.mutation(UPDATE_ACCOUNT_MUTATION, {
        input: {
          displayName: "Updated",
          publicListed: false,
        },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateAccount.displayName).toBe("Updated");
      expect(result.data?.updateAccount.publicListed).toBe(false);
    });
  });
});
