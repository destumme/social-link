import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  cleanDatabase,
  getTestPrisma,
  setupTestDb,
  teardownTestDb,
} from "@/tests/helpers/testDb";
import { createTestGraphQLClient } from "@/tests/helpers/graphqlClient";

const MY_CONNECTION_GROUPS_QUERY = `
  query {
    myConnectionGroups {
      id
      name
    }
  }
`;

const CREATE_CONNECTION_GROUP_MUTATION = `
  mutation($input: CreateConnectionGroupInput!) {
    createConnectionGroup(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_CONNECTION_GROUP_MUTATION = `
  mutation($id: ID!, $input: UpdateConnectionGroupInput!) {
    updateConnectionGroup(id: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_CONNECTION_GROUP_MUTATION = `
  mutation($id: ID!) {
    deleteConnectionGroup(id: $id)
  }
`;

const ADD_TRAIT_TO_GROUP_MUTATION = `
  mutation($groupId: ID!, $traitId: ID!) {
    addTraitToGroup(groupId: $groupId, traitId: $traitId) {
      id
      name
    }
  }
`;

const REMOVE_TRAIT_FROM_GROUP_MUTATION = `
  mutation($groupId: ID!, $traitId: ID!) {
    removeTraitFromGroup(groupId: $groupId, traitId: $traitId) {
      id
      name
    }
  }
`;

describe("GraphQL ConnectionGroup", () => {
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
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        emailVerified: false,
        displayName: "Test User",
        username: `testuser-${Date.now()}`,
      },
    });
    accountId = user.id;
    client = createTestGraphQLClient(accountId);
  });

  describe("myConnectionGroups", () => {
    it("returns connection groups owned by the authenticated account", async () => {
      const prisma = getTestPrisma();
      await prisma.connectionGroup.create({
        data: {
          name: "Friends",
          accountId,
        },
      });

      const result = await client.query(MY_CONNECTION_GROUPS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.myConnectionGroups).toHaveLength(1);
      expect(result.data?.myConnectionGroups[0].name).toBe("Friends");
    });

    it("returns empty array when no groups exist", async () => {
      const result = await client.query(MY_CONNECTION_GROUPS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.myConnectionGroups).toEqual([]);
    });

    it("does not return groups from other accounts", async () => {
      const prisma = getTestPrisma();
      const otherUser = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          name: "Other",
          email: `other-${Date.now()}@example.com`,
          emailVerified: false,
          displayName: "Other",
          username: `other-${Date.now()}`,
        },
      });
      await prisma.connectionGroup.create({
        data: {
          name: "Other Group",
          accountId: otherUser.id,
        },
      });

      const result = await client.query(MY_CONNECTION_GROUPS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.myConnectionGroups).toEqual([]);
    });
  });

  describe("createConnectionGroup", () => {
    it("creates a group with just a name", async () => {
      const result = await client.mutation(CREATE_CONNECTION_GROUP_MUTATION, {
        input: { name: "Colleagues" },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.createConnectionGroup.id).toBeDefined();
      expect(result.data?.createConnectionGroup.name).toBe("Colleagues");
    });

    it("creates a group with connected traits", async () => {
      const prisma = getTestPrisma();
      const trait = await prisma.trait.create({
        data: {
          key: "email",
          value: "test@example.com",
          category: "CONTACT_INFO",
          accountId,
        },
      });

      const result = await client.mutation(CREATE_CONNECTION_GROUP_MUTATION, {
        input: { name: "Close Friends", traitIds: [trait.id] },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.createConnectionGroup.name).toBe("Close Friends");

      const group = await prisma.connectionGroup.findUnique({
        where: { id: result.data?.createConnectionGroup.id },
        include: { traits: true },
      });
      expect(group?.traits).toHaveLength(1);
      expect(group?.traits[0].id).toBe(trait.id);
    });

    it("associates group with authenticated account", async () => {
      await client.mutation(CREATE_CONNECTION_GROUP_MUTATION, {
        input: { name: "Family" },
      });

      const prisma = getTestPrisma();
      const groups = await prisma.connectionGroup.findMany({
        where: { accountId },
      });

      expect(groups).toHaveLength(1);
      expect(groups[0].name).toBe("Family");
    });
  });

  describe("updateConnectionGroup", () => {
    it("updates the group name", async () => {
      const prisma = getTestPrisma();
      const group = await prisma.connectionGroup.create({
        data: { name: "Old Name", accountId },
      });

      const result = await client.mutation(UPDATE_CONNECTION_GROUP_MUTATION, {
        id: group.id,
        input: { name: "New Name" },
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.updateConnectionGroup.name).toBe("New Name");
    });

    it("updates traits via traitIds", async () => {
      const prisma = getTestPrisma();
      const trait1 = await prisma.trait.create({
        data: {
          key: "email",
          value: "a@b.com",
          category: "CONTACT_INFO",
          accountId,
        },
      });
      const trait2 = await prisma.trait.create({
        data: {
          key: "phone",
          value: "123",
          category: "CONTACT_INFO",
          accountId,
        },
      });
      const group = await prisma.connectionGroup.create({
        data: {
          name: "Group",
          accountId,
          traits: { connect: [{ id: trait1.id }] },
        },
      });

      const result = await client.mutation(UPDATE_CONNECTION_GROUP_MUTATION, {
        id: group.id,
        input: { traitIds: [trait2.id] },
      });

      expect(result.error).toBeUndefined();

      const updated = await prisma.connectionGroup.findUnique({
        where: { id: group.id },
        include: { traits: true },
      });
      expect(updated?.traits).toHaveLength(1);
      expect(updated?.traits[0].id).toBe(trait2.id);
    });

    it("throws error for non-existent group", async () => {
      const result = await client.mutation(UPDATE_CONNECTION_GROUP_MUTATION, {
        id: "nonexistent-id",
        input: { name: "Test" },
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("Connection group not found");
    });
  });

  describe("deleteConnectionGroup", () => {
    it("deletes a group and returns true", async () => {
      const prisma = getTestPrisma();
      const group = await prisma.connectionGroup.create({
        data: { name: "To Delete", accountId },
      });

      const result = await client.mutation(DELETE_CONNECTION_GROUP_MUTATION, {
        id: group.id,
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.deleteConnectionGroup).toBe(true);

      const deleted = await prisma.connectionGroup.findUnique({
        where: { id: group.id },
      });
      expect(deleted).toBeNull();
    });

    it("throws error for non-existent group", async () => {
      const result = await client.mutation(DELETE_CONNECTION_GROUP_MUTATION, {
        id: "nonexistent-id",
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("Connection group not found");
    });
  });

  describe("addTraitToGroup", () => {
    it("connects a trait to a group", async () => {
      const prisma = getTestPrisma();
      const trait = await prisma.trait.create({
        data: {
          key: "email",
          value: "test@example.com",
          category: "CONTACT_INFO",
          accountId,
        },
      });
      const group = await prisma.connectionGroup.create({
        data: { name: "Group", accountId },
      });

      const result = await client.mutation(ADD_TRAIT_TO_GROUP_MUTATION, {
        groupId: group.id,
        traitId: trait.id,
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.addTraitToGroup.id).toBe(group.id);

      const updated = await prisma.connectionGroup.findUnique({
        where: { id: group.id },
        include: { traits: true },
      });
      expect(updated?.traits).toHaveLength(1);
      expect(updated?.traits[0].id).toBe(trait.id);
    });
  });

  describe("removeTraitFromGroup", () => {
    it("disconnects a trait from a group", async () => {
      const prisma = getTestPrisma();
      const trait = await prisma.trait.create({
        data: {
          key: "email",
          value: "test@example.com",
          category: "CONTACT_INFO",
          accountId,
        },
      });
      const group = await prisma.connectionGroup.create({
        data: {
          name: "Group",
          accountId,
          traits: { connect: [{ id: trait.id }] },
        },
      });

      const result = await client.mutation(REMOVE_TRAIT_FROM_GROUP_MUTATION, {
        groupId: group.id,
        traitId: trait.id,
      });

      expect(result.error).toBeUndefined();

      const updated = await prisma.connectionGroup.findUnique({
        where: { id: group.id },
        include: { traits: true },
      });
      expect(updated?.traits).toHaveLength(0);
    });
  });
});
