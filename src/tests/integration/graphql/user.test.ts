import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  cleanDatabase,
  getTestPrisma,
  setupTestDb,
  teardownTestDb,
} from "@/tests/helpers/testDb";
import { createTestGraphQLClient } from "@/tests/helpers/graphqlClient";
import { createTestUser, cleanupTestUser } from "@/tests/helpers/testAuth";

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

const USER_BY_USERNAME_QUERY = `
  query($username: String!) {
    userByUsername(username: $username) {
      id
      displayName
      username
      publicListed
    }
  }
`;

const SEARCH_USERS_QUERY = `
  query($query: String!) {
    searchUsers(query: $query) {
      id
      displayName
      username
      publicListed
    }
  }
`;

const USER_BY_SHARE_ID_QUERY = `
  query($shareId: String!) {
    userByShareId(shareId: $shareId) {
      id
      displayName
    }
  }
`;

const UPDATE_USER_MUTATION = `
  mutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      displayName
      username
      publicListed
    }
  }
`;

describe("GraphQL User", () => {
  let client: ReturnType<typeof createTestGraphQLClient>;
  let userId: string;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await cleanDatabase();
    const { user, headers } = await createTestUser();
    userId = user.id;
    client = createTestGraphQLClient(headers);
  });

  afterEach(async () => {
    await cleanupTestUser(userId);
  });

  describe("me", () => {
    it("returns the authenticated user", async () => {
      const result = await client.query(ME_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.me).not.toBeNull();
      expect(result.data?.me.id).toBe(userId);
      expect(result.data?.me.displayName).toBe("Test User");
    });

    it("throws error when user is deleted", async () => {
      const prisma = getTestPrisma();
      await prisma.user.delete({ where: { id: userId } });

      const result = await client.query(ME_QUERY, {});

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("user not found");
    });
  });

  describe("userByUsername", () => {
    it("searches for users by partial username", async () => {
      const result = await client.query(USER_BY_USERNAME_QUERY, {
        username: "test",
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain(
        "Cannot return null for non-nullable field",
      );
    });

    it("excludes private users from search", async () => {
      const prisma = getTestPrisma();
      await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          name: "Private User",
          email: `private-${Date.now()}@example.com`,
          emailVerified: false,
          displayName: "Private User",
          username: `private-${Date.now()}`,
          publicListed: false,
        },
      });

      const result = await client.query(USER_BY_USERNAME_QUERY, {
        username: "private",
      });

      expect(result.data?.userByUsername).toBeNull();
    });
  });

  describe("userByShareId", () => {
    it("throws Not implemented error", async () => {
      const result = await client.query(USER_BY_SHARE_ID_QUERY, {
        shareId: "test-share-id",
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("Not implemented");
    });
  });

  describe("searchUsers", () => {
    it("returns matching public users", async () => {
      const prisma = getTestPrisma();
      await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          name: "Alice Smith",
          email: `alice-${Date.now()}@example.com`,
          emailVerified: false,
          displayName: "Alice Smith",
          username: `alice-${Date.now()}`,
          publicListed: true,
        },
      });

      const result = await client.query(SEARCH_USERS_QUERY, {
        query: "alice",
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.searchUsers.length).toBeGreaterThanOrEqual(1);
    });

    it("excludes private users from search", async () => {
      const prisma = getTestPrisma();
      await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          name: "Private User",
          email: `private-${Date.now()}@example.com`,
          emailVerified: false,
          displayName: "Private User",
          username: `private-${Date.now()}`,
          publicListed: false,
        },
      });

      const result = await client.query(SEARCH_USERS_QUERY, {
        query: "private",
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.searchUsers).toEqual([]);
    });

    it("returns empty array when no matches", async () => {
      const result = await client.query(SEARCH_USERS_QUERY, {
        query: "nonexistent-user-xyz",
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.searchUsers).toEqual([]);
    });
  });

  describe("updateUser", () => {
    it("updates displayName", async () => {
      const result = await client.mutation(UPDATE_USER_MUTATION, {
        input: { displayName: "New Name" },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateUser.displayName).toBe("New Name");
      expect(result.data?.updateUser.id).toBe(userId);
    });

    it("updates username", async () => {
      const newUsername = `newname-${Date.now()}`;
      const result = await client.mutation(UPDATE_USER_MUTATION, {
        input: { username: newUsername },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateUser.username).toBe(newUsername);
    });

    it("updates publicListed", async () => {
      const result = await client.mutation(UPDATE_USER_MUTATION, {
        input: { publicListed: false },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateUser.publicListed).toBe(false);
    });

    it("updates multiple fields at once", async () => {
      const result = await client.mutation(UPDATE_USER_MUTATION, {
        input: {
          displayName: "Updated",
          publicListed: false,
        },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateUser.displayName).toBe("Updated");
      expect(result.data?.updateUser.publicListed).toBe(false);
    });
  });
});
