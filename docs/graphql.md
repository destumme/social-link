# GraphQL Schema

## Types

```graphql
enum TraitCategory {
  PHONE_NUMBER
  EMAIL
  SOCIAL_MEDIA_LINK
  WEBSITE_LINK
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
  traits: [Trait!]!
  createdAt: DateTime!
}

type ConnectionGroup {
  id: ID!
  account: Account!
  name: String!
  connections: [Connection!]!
  traits: [Trait!]!
}

```

## Queries

```graphql
type Query {
  # Account
  me: Account
  accountByUsername(username: String!): Account
  accountByShareId(shareId: String!): Account

  # Traits
  myTraits: [Trait!]!
  traitById(id: ID!): Trait

  # Connection Groups
  myConnectionGroups: [ConnectionGroup!]!

  # Connections
  myConnections: [Connection!]!
  pendingConnections: [Connection!]!
  connectionByAccount(accountId: ID!): Connection

  # Search
  searchAccounts(query: String!): [Account!]!
}
```

## Mutations

```graphql
type Mutation {
  # Account
  updateAccount(input: UpdateAccountInput!): Account!

  # Traits
  createTrait(input: CreateTraitInput!): Trait!
  updateTrait(id: ID!, input: UpdateTraitInput!): Trait!
  deleteTrait(id: ID!): Boolean!

  # Connection Groups
  createConnectionGroup(input: CreateConnectionGroupInput!): ConnectionGroup!
  updateConnectionGroup(id: ID!, input: UpdateConnectionGroupInput!): ConnectionGroup!
  deleteConnectionGroup(id: ID!): Boolean!
  addTraitToGroup(groupId: ID!, traitId: ID!): ConnectionGroup!
  removeTraitFromGroup(groupId: ID!, traitId: ID!): ConnectionGroup!

  # Connections
  requestConnection(accountId: ID!, input: RequestConnectionInput!): Connection!
  acceptConnection(connectionId: ID!): Connection!
  declineConnection(connectionId: ID!): Boolean!
  removeConnection(id: ID!): Boolean!
  addConnectionToGroup(connectionId: ID!, groupId: ID!): Connection!
  removeConnectionFromGroup(connectionId: ID!, groupId: ID!): Connection!
  updateConnectionTraits(connectionId: ID!, traitIds: [ID!]!): Connection!
}
```

## Input Types

```graphql
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
```

## Coverage

### /edit/groups

- **Create Group**: `createConnectionGroup`
- **Rename Group**: `updateConnectionGroup`
- **Delete Group**: `deleteConnectionGroup`
- **Add Account to Group**: `addConnectionToGroup`
- **Remove Account from Group**: `removeConnectionFromGroup`

### /edit/traits

- **Create Trait**: `createTrait`
- **Delete Trait**: `deleteTrait`
- **Edit Trait**: `updateTrait`
- **Toggle Group Visibility on Trait**: `addTraitToGroup`, `removeTraitFromGroup`

### /settings

- **Add/Remove OAuth Login on Account**: Handled via BetterAuth

### /link

- **View Pending Connection Requests**: `pendingConnections`
- **Accept Connection**: `acceptConnection`
- **Decline Connection**: `declineConnection`

### /link/{username}

- **Request Connection**: `requestConnection`
- **View Account Page**: `accountByUsername`, `accountByShareId`
- **View Connection Details**: `connectionByAccount`
- **Remove Connection**: `removeConnection`

### Global

- **Search for Users**: `searchAccounts`
- **Create Account**: Handled via BetterAuth OAuth flow
- **Account Management**: `me`, `updateAccount`, `accountByShareId`
