export const typeDefs = /* GraphQL */ `
  scalar DateTime

  enum TraitCategory {
    CONTACT_INFO
    MAILING_ADDRESS
    SOCIAL_LINK
    PROFESSIONAL_LINK
    WEBSITE_LINK
    MESSAGING_HANDLE
    OTHER
  }

  enum ConnectionStatus {
    PENDING
    ACCEPTED
    DECLINED
  }

  type Account {
    id: ID!
    displayName: String!
    username: String!
    publicListed: Boolean!
    traits: [Trait!]!
    connections: [Connection!]!
    connectionGroups: [ConnectionGroup!]!
  }

  type Trait {
    id: ID!
    account: Account!
    key: String!
    value: String!
    category: TraitCategory
    icon: String
    visibleGroups: [ConnectionGroup!]!
  }

  type Connection {
    id: ID!
    account: Account!
    connectedAccount: Account!
    status: ConnectionStatus!
    groups: [ConnectionGroup!]!
    createdAt: DateTime!
  }

  type ConnectionGroup {
    id: ID!
    account: Account!
    name: String!
    connections: [Connection!]!
    traits: [Trait!]!
  }

  input UpdateAccountInput {
    displayName: String
    username: String
    publicListed: Boolean
  }

  input CreateTraitInput {
    key: String!
    value: String!
    category: TraitCategory!
    icon: String
  }

  input UpdateTraitInput {
    key: String
    value: String
    category: TraitCategory
    icon: String
  }

  input CreateConnectionGroupInput {
    name: String!
    traitIds: [ID!]
  }

  input UpdateConnectionGroupInput {
    name: String
    traitIds: [ID!]
  }

  input RequestConnectionInput {
    groupIds: [ID!]
    sharedTraitIds: [ID!]
  }

  type Query {
    me: Account
    accountByUsername(username: String!): Account
    accountByShareId(shareId: String!): Account

    myTraits: [Trait!]!
    traitById(id: ID!): Trait

    myConnectionGroups: [ConnectionGroup!]!

    myConnections: [Connection!]!
    pendingConnections: [Connection!]!
    connectionByAccount(accountId: ID!): Connection

    searchAccounts(query: String!): [Account!]!
  }

  type Mutation {
    updateAccount(input: UpdateAccountInput!): Account!

    createTrait(input: CreateTraitInput!): Trait!
    updateTrait(id: ID!, input: UpdateTraitInput!): Trait!
    deleteTrait(id: ID!): Boolean!

    createConnectionGroup(input: CreateConnectionGroupInput!): ConnectionGroup!
    updateConnectionGroup(
      id: ID!
      input: UpdateConnectionGroupInput!
    ): ConnectionGroup!
    deleteConnectionGroup(id: ID!): Boolean!
    addTraitToGroup(groupId: ID!, traitId: ID!): ConnectionGroup!
    removeTraitFromGroup(groupId: ID!, traitId: ID!): ConnectionGroup!

    requestConnection(
      accountId: ID!
      input: RequestConnectionInput!
    ): Connection!
    acceptConnection(connectionId: ID!): Connection!
    declineConnection(connectionId: ID!): Boolean!
    removeConnection(id: ID!): Boolean!
    addConnectionToGroup(connectionId: ID!, groupId: ID!): Connection!
    removeConnectionFromGroup(connectionId: ID!, groupId: ID!): Connection!
    updateConnectionTraits(connectionId: ID!, traitIds: [ID!]!): Connection!
  }
`;
