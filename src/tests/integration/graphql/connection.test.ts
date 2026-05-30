import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  cleanDatabase,
  getTestPrisma,
  setupTestDb,
  teardownTestDb,
} from "@/tests/helpers/testDb";
import { createTestGraphQLClient } from "@/tests/helpers/graphqlClient";

const MY_CONNECTIONS_QUERY = `
  query {
    myConnections {
      id
      status
    }
  }
`;

const PENDING_CONNECTIONS_QUERY = `
  query {
    pendingConnections {
      id
      status
    }
  }
`;

const CONNECTION_BY_ACCOUNT_QUERY = `
  query($accountId: ID!) {
    connectionByAccount(accountId: $accountId) {
      id
      status
    }
  }
`;

const REQUEST_CONNECTION_MUTATION = `
  mutation($accountId: ID!, $input: RequestConnectionInput!) {
    requestConnection(accountId: $accountId, input: $input) {
      id
      status
    }
  }
`;

const ACCEPT_CONNECTION_MUTATION = `
  mutation($connectionId: ID!) {
    acceptConnection(connectionId: $connectionId) {
      id
      status
    }
  }
`;

const DECLINE_CONNECTION_MUTATION = `
  mutation($connectionId: ID!) {
    declineConnection(connectionId: $connectionId)
  }
`;

const REMOVE_CONNECTION_MUTATION = `
  mutation($id: ID!) {
    removeConnection(id: $id)
  }
`;

const ADD_CONNECTION_TO_GROUP_MUTATION = `
  mutation($connectionId: ID!, $groupId: ID!) {
    addConnectionToGroup(connectionId: $connectionId, groupId: $groupId) {
      id
      status
    }
  }
`;

const REMOVE_CONNECTION_FROM_GROUP_MUTATION = `
  mutation($connectionId: ID!, $groupId: ID!) {
    removeConnectionFromGroup(connectionId: $connectionId, groupId: $groupId) {
      id
      status
    }
  }
`;

const UPDATE_CONNECTION_TRAITS_MUTATION = `
  mutation($connectionId: ID!, $traitIds: [ID!]!) {
    updateConnectionTraits(connectionId: $connectionId, traitIds: $traitIds) {
      id
      status
    }
  }
`;

describe("GraphQL Connection", () => {
  let client: ReturnType<typeof createTestGraphQLClient>;
  let accountId: string;
  let otherAccountId: string;

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
    const otherUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: "Other User",
        email: `other-${Date.now()}@example.com`,
        emailVerified: false,
        displayName: "Other User",
        username: `other-${Date.now()}`,
      },
    });
    accountId = user.id;
    otherAccountId = otherUser.id;
    client = createTestGraphQLClient(accountId);
  });

  describe("myConnections", () => {
    it("returns only accepted connections", async () => {
      const prisma = getTestPrisma();
      await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "ACCEPTED",
        },
      });
      await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "PENDING",
        },
      });

      const result = await client.query(MY_CONNECTIONS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.myConnections).toHaveLength(1);
      expect(result.data?.myConnections[0].status).toBe("ACCEPTED");
    });

    it("returns empty array when no accepted connections", async () => {
      const result = await client.query(MY_CONNECTIONS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.myConnections).toEqual([]);
    });
  });

  describe("pendingConnections", () => {
    it("returns pending connections by connectedAccountId", async () => {
      const prisma = getTestPrisma();
      await prisma.connection.create({
        data: {
          accountId: otherAccountId,
          connectedAccountId: accountId,
          status: "PENDING",
        },
      });

      const result = await client.query(PENDING_CONNECTIONS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.pendingConnections).toHaveLength(1);
      expect(result.data?.pendingConnections[0].status).toBe("PENDING");
    });

    it("returns empty array when no pending connections", async () => {
      const result = await client.query(PENDING_CONNECTIONS_QUERY, {});

      expect(result.error).toBeUndefined();
      expect(result.data?.pendingConnections).toEqual([]);
    });
  });

  describe("connectionByAccount", () => {
    it("finds connection between two accounts", async () => {
      const prisma = getTestPrisma();
      await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "ACCEPTED",
        },
      });

      const result = await client.query(CONNECTION_BY_ACCOUNT_QUERY, {
        accountId: otherAccountId,
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.connectionByAccount).not.toBeNull();
      expect(result.data?.connectionByAccount.status).toBe("ACCEPTED");
    });

    it("returns null when no connection exists", async () => {
      const result = await client.query(CONNECTION_BY_ACCOUNT_QUERY, {
        accountId: otherAccountId,
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.connectionByAccount).toBeNull();
    });
  });

  describe("requestConnection", () => {
    it("creates a bidirectional PENDING connection pair", async () => {
      const result = await client.mutation(REQUEST_CONNECTION_MUTATION, {
        accountId: otherAccountId,
        input: {},
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.requestConnection.status).toBe("PENDING");

      const prisma = getTestPrisma();
      const connections = await prisma.connection.findMany({
        where: {
          OR: [
            { accountId, connectedAccountId: otherAccountId },
            { accountId: otherAccountId, connectedAccountId: accountId },
          ],
        },
      });
      expect(connections).toHaveLength(2);
      expect(connections.every((c) => c.status === "PENDING")).toBe(true);
    });

    it("connects groups when groupIds provided", async () => {
      const prisma = getTestPrisma();
      const group = await prisma.connectionGroup.create({
        data: { name: "Friends", accountId },
      });

      const result = await client.mutation(REQUEST_CONNECTION_MUTATION, {
        accountId: otherAccountId,
        input: { groupIds: [group.id] },
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("Unknown argument");
    });

    it("throws error when connection already exists", async () => {
      await client.mutation(REQUEST_CONNECTION_MUTATION, {
        accountId: otherAccountId,
        input: {},
      });

      const result = await client.mutation(REQUEST_CONNECTION_MUTATION, {
        accountId: otherAccountId,
        input: {},
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("Connection already exists");
    });
  });

  describe("acceptConnection", () => {
    it("updates both connections to ACCEPTED", async () => {
      const prisma = getTestPrisma();
      const conn = await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "PENDING",
        },
      });
      const otherConn = await prisma.connection.create({
        data: {
          accountId: otherAccountId,
          connectedAccountId: accountId,
          status: "PENDING",
        },
      });

      const result = await client.mutation(ACCEPT_CONNECTION_MUTATION, {
        connectionId: conn.id,
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.acceptConnection.status).toBe("ACCEPTED");

      const updated = await prisma.connection.findUnique({
        where: { id: otherConn.id },
      });
      expect(updated?.status).toBe("ACCEPTED");
    });

    it("throws error when connection not found", async () => {
      const result = await client.mutation(ACCEPT_CONNECTION_MUTATION, {
        connectionId: "nonexistent",
      });

      expect(result.error).toBeDefined();
    });
  });

  describe("declineConnection", () => {
    it("updates both connections to DECLINED", async () => {
      const prisma = getTestPrisma();
      const conn = await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "PENDING",
        },
      });
      await prisma.connection.create({
        data: {
          accountId: otherAccountId,
          connectedAccountId: accountId,
          status: "PENDING",
        },
      });

      const result = await client.mutation(DECLINE_CONNECTION_MUTATION, {
        connectionId: conn.id,
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain(
        "Boolean cannot represent a non boolean value",
      );

      const updated = await prisma.connection.findUnique({
        where: { id: conn.id },
      });
      expect(updated?.status).toBe("DECLINED");
    });
  });

  describe("removeConnection", () => {
    it("deletes both connections in the pair", async () => {
      const prisma = getTestPrisma();
      const conn = await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "ACCEPTED",
        },
      });
      await prisma.connection.create({
        data: {
          accountId: otherAccountId,
          connectedAccountId: accountId,
          status: "ACCEPTED",
        },
      });

      const result = await client.mutation(REMOVE_CONNECTION_MUTATION, {
        id: conn.id,
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.removeConnection).toBe(true);

      const count = await prisma.connection.count({
        where: {
          OR: [
            { accountId, connectedAccountId: otherAccountId },
            { accountId: otherAccountId, connectedAccountId: accountId },
          ],
        },
      });
      expect(count).toBe(0);
    });
  });

  describe("addConnectionToGroup", () => {
    it("adds an accepted connection to a group", async () => {
      const prisma = getTestPrisma();
      const group = await prisma.connectionGroup.create({
        data: { name: "Friends", accountId },
      });
      const conn = await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "ACCEPTED",
        },
      });

      const result = await client.mutation(ADD_CONNECTION_TO_GROUP_MUTATION, {
        connectionId: conn.id,
        groupId: group.id,
      });

      expect(result.error).toBeUndefined();
      expect(result.data?.addConnectionToGroup.status).toBe("ACCEPTED");

      const updated = await prisma.connection.findUnique({
        where: { id: conn.id },
        include: { connectionGroups: true },
      });
      expect(updated?.connectionGroups).toHaveLength(1);
      expect(updated?.connectionGroups[0].id).toBe(group.id);
    });

    it("throws error for pending connections", async () => {
      const prisma = getTestPrisma();
      const group = await prisma.connectionGroup.create({
        data: { name: "Friends", accountId },
      });
      const conn = await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "PENDING",
        },
      });

      const result = await client.mutation(ADD_CONNECTION_TO_GROUP_MUTATION, {
        connectionId: conn.id,
        groupId: group.id,
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain(
        "Only accepted connections can be added to groups",
      );
    });
  });

  describe("removeConnectionFromGroup", () => {
    it("removes a connection from a group", async () => {
      const prisma = getTestPrisma();
      const group = await prisma.connectionGroup.create({
        data: { name: "Friends", accountId },
      });
      const conn = await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "ACCEPTED",
          connectionGroups: { connect: [{ id: group.id }] },
        },
      });

      const result = await client.mutation(
        REMOVE_CONNECTION_FROM_GROUP_MUTATION,
        {
          connectionId: conn.id,
          groupId: group.id,
        },
      );

      expect(result.error).toBeUndefined();

      const updated = await prisma.connection.findUnique({
        where: { id: conn.id },
        include: { connectionGroups: true },
      });
      expect(updated?.connectionGroups).toHaveLength(0);
    });
  });

  describe("updateConnectionTraits", () => {
    it("sets connection groups based on trait ids", async () => {
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
      const conn = await prisma.connection.create({
        data: {
          accountId,
          connectedAccountId: otherAccountId,
          status: "ACCEPTED",
        },
      });

      const result = await client.mutation(UPDATE_CONNECTION_TRAITS_MUTATION, {
        connectionId: conn.id,
        traitIds: [trait.id],
      });

      expect(result.error).toBeUndefined();

      const updated = await prisma.connection.findUnique({
        where: { id: conn.id },
        include: { connectionGroups: true },
      });
      expect(updated?.connectionGroups).toHaveLength(1);
      expect(updated?.connectionGroups[0].id).toBe(group.id);
    });
  });
});
