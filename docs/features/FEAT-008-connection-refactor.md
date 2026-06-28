# FEAT-008: Connection Data Model Refactor — Single Shared Connection

---
page: multiple
area: data-model / connections
priority: high
status: proposed
created: 2026-06-22
---

//TODO: Update this so that the connectionSides are transparently the connection to the api surface layer and application ui logic. The relational structure should stay below the data access.

## Summary

Refactor the `Connection` model from two independent per-user connection records into a single shared record representing the bidirectional relationship. Introduce a `ConnectionSide` table to hold each user's isolated group assignments. Enforce that one user cannot be connected to another without the reverse being true — the connection is a single atom.

## Motivation

Currently, a connection between two users creates two separate `Connection` records — one owned by each user. This leads to data inconsistency risks (e.g., one side ACCEPTED while the other is PENDING), duplicate management logic, and no way to enforce that a connection is always symmetric. A single shared `Connection` record eliminates these problems: the status is authoritative for both users, and each user's group assignments remain independent but tied to the same relationship.

## Scope

**In scope:**
- New `Connection` model: single record with `initiator`, `recipient`, single `status`
- New `ConnectionSide` model: per-user grouping of group assignments to a connection
- Update `ConnectionGroup` to reference `ConnectionSide` instead of `Connection` directly
- Update `User` model relations (remove `connections`/`connectedTo`, add `sides`)
- GraphQL schema changes to reflect new `Connection` and `ConnectionSide` types
- Update `connectionService.ts` for all CRUD operations
- Update `userService.ts` for connection lookups and filtering
- Update all UI components that consume connection data (pending table, connections table, link page)
- Prisma migration + truncate existing data
- Update seed script to use new model

**Out of scope:**
- Changing trait visibility logic (traits still reference `ConnectionGroup`, which remains)
- Changing how groups are created or managed
- Adding new connection features (this is purely a refactor)

## Design

### Data model

**Before:**

```
Connection {
  id, accountId, connectedAccountId, status, connectionGroups[]
}
// Two records per relationship: A→B and B→A
```

**After:**

```prisma
model Connection {
  id           String           @id @default(uuid())
  initiator    User             @relation("ConnectionInitiator", fields: [initiatorId], references: [id])
  initiatorId  String
  recipient    User             @relation("ConnectionRecipient", fields: [recipientId], references: [id])
  recipientId  String
  status       ConnectionStatus
  sides        ConnectionSide[]
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt

  @@unique([initiatorId, recipientId])
}

model ConnectionSide {
  id            String            @id @default(uuid())
  connection    Connection        @relation(fields: [connectionId], references: [id])
  connectionId  String
  account       User              @relation(fields: [accountId], references: [id])
  accountId     String
  groups        ConnectionGroup[]

  @@unique([connectionId, accountId])
}
```

**User model changes:**

```diff
- connections      Connection[]      @relation("connections")
- connectedTo      Connection[]      @relation("connectedTo")
+ sides            ConnectionSide[]
```

**ConnectionGroup changes:**

```diff
- connections        Connection[]
+ sides              ConnectionSide[]
```

**Semantics:**
- `initiator` is the user who sent the connection request
- `recipient` is the user who receives the pending request
- `status` is the single authoritative state: `PENDING` → `ACCEPTED` or `DECLINED`
- A `ConnectionSide` is created for the initiator on request, and for the recipient on acceptance
- Group assignments are isolated per-user via their `ConnectionSide`

### Connection lifecycle

1. **Initiator requests connection with recipient:**
   - Create `Connection(initiator=A, recipient=B, status=PENDING)` + `ConnectionSide(connection, account=A, groups=[])`
2. **Recipient sees pending requests:**
   - Query: `Connection` where `recipientId = B` AND `status = PENDING`
3. **Recipient accepts:**
   - Update `status → ACCEPTED`, create `ConnectionSide(connection, account=B, groups=[])`
4. **Recipient declines:**
   - Update `status → DECLINED`
5. **Removing a connection:**
   - Delete the `Connection` record (cascades to `ConnectionSide`s)

### GraphQL schema changes

```graphql
type Connection {
  id: ID!
  initiator: User!
  recipient: User!
  status: ConnectionStatus!
  sides: [ConnectionSide!]!
  createdAt: DateTime!
}

type ConnectionSide {
  id: ID!
  account: User!
  groups: [ConnectionGroup!]!
}
```

Queries to update:
- `pendingConnections` → return `Connection` records where current user is the `recipient` and `status = PENDING`
- `myConnections` → return `Connection` records where current user is the `initiator` or `recipient` and `status = ACCEPTED`
- `searchAccounts` → may need updates for connection filtering

Mutations:
- `requestConnection(recipientId: ID!): Connection!` — creates Connection + initiator side
- `acceptConnection(connectionId: ID!): Connection!` — updates status + creates recipient side
- `declineConnection(connectionId: ID!): Boolean!` — updates status
- `removeConnection(connectionId: ID!): Boolean!` — deletes Connection (cascades sides)

Group assignment actions (updating which groups a side has):
- `updateConnectionGroups(connectionId: ID!, groupIds: [ID!]!): ConnectionSide!`

### Services to update

| Service | Changes |
|---|---|
| `connectionService.ts` | Rewrite `requestConnection`, `acceptConnection`, `declineConnection`, `removeConnection`, `findConnectionBetweenAccounts` |
| `userService.ts` | Update `findUserWithTraitsByUsername` — connection check now looks at shared Connection |
| `connectionService.ts` (search) | Update pending connections query, my connections query, connection status lookup |

### UI components to update

| Component | Changes |
|---|---|
| `pending-connections-table.tsx` | GraphQL query now fetches `Connection.initiator` instead of `connectedAccount` |
| `pending-connection-row.tsx` | Adapt to new connection shape (`initiator` is the requester) |
| `connections-table.tsx` | Adapt to new connection shape (resolve to the "other" user: the one who isn't the current user) |
| `connection-row.tsx` | Adapt to new connection shape |
| `link/[username]/page.tsx` | Connection check uses shared Connection model |

### Migration plan

1. Design the new schema in `prisma/schema.prisma`
2. Run `yarn prisma migrate dev` (with `--create-only` if needed) — **this will truncate Connection and ConnectionGroup data**
3. Update the seed script to create single `Connection` records + `ConnectionSide`s
4. Update all services, resolvers, and UI components
5. Run seed: `yarn run prisma db seed`

## Notes

- Prisma schema: `prisma/schema.prisma` — `Connection` model at line 71, `ConnectionGroup` at line 83, `User` at line 31
- Connection service: `src/lib/services/connectionService.ts`
- User service: `src/lib/services/userService.ts`
- GraphQL types: `src/lib/graphql/typeDefs.ts`
- GraphQL resolvers: `src/lib/graphql/resolvers/`
- Seed script: `prisma/seed.ts`
- Pending connections table: `src/app/link/_components/pending-connections-table.tsx`
- Connections table: `src/app/link/_components/connections-table.tsx`
- Link page: `src/app/link/[username]/page.tsx`

## Agent Instructions

**What to look for:**
All code that creates, reads, or modifies `Connection` records. The refactor touches nearly every part of the connection domain: the model, service, GraphQL layer, and UI.

**Files to check:**
- `prisma/schema.prisma` — replace Connection model + add ConnectionSide, update User and ConnectionGroup
- `prisma/seed.ts` — rewrite connection creation to use new model
- `src/lib/graphql/typeDefs.ts` — update Connection type (rename `userA`/`userB` → `initiator`/`recipient`), add ConnectionSide type
- `src/lib/graphql/resolvers/` — update connection-related resolvers
- `src/lib/services/connectionService.ts` — rewrite all connection operations using `initiator`/`recipient`
- `src/lib/services/userService.ts` — update connection lookups using `initiatorId`/`recipientId`
- `src/app/link/_components/pending-connections-table.tsx` — update query to fetch `Connection.initiator`
- `src/app/link/_components/pending-connection-row.tsx` — update props for new shape
- `src/app/link/_components/connections-table.tsx` — update query
- `src/app/link/_components/connection-row.tsx` — update props for new shape
- `src/app/link/[username]/page.tsx` — update connection check
- `src/app/traits/` — any code referencing `connection.connectedAccount`
- `src/tests/` — update test fixtures and integration tests

**What not to change:**
- Trait model and visibility logic (traits still reference ConnectionGroup, which still exists)
- Auth, session, or user creation flow
- ConnectionGroup CRUD (groups still exist, just reference ConnectionSide instead of Connection)

**Verification:**
1. Run `yarn prisma migrate dev` → new schema applied, old Connection data truncated
2. Run `yarn run prisma db seed` → users, connections, sides, and groups created with new model
3. Visit `/link` as Alice → see pending requests and existing connections rendered correctly
4. Visit `/link/bob` as Alice → page loads with correct connection status
5. Request a new connection → single Connection record created with initiator side
6. Accept a connection → status updates, recipient side created
7. Decline a connection → status updates to DECLINED
8. Remove a connection → Connection and both sides deleted
9. Update connection group assignments → side's groups updated
10. Run `yarn lint`
11. Run existing test suite

## Tasks

- [ ] Design new Connection and ConnectionSide models in `prisma/schema.prisma` using `initiator`/`recipient` field names
- [ ] Update User model relations in schema
- [ ] Update ConnectionGroup model relations in schema
- [ ] Run `yarn prisma migrate dev` (truncates old connection data)
- [ ] Run `yarn prisma generate`
- [ ] Update `src/lib/graphql/typeDefs.ts` — new Connection type (`initiator`/`recipient`), new ConnectionSide type
- [ ] Update connection resolvers (`requestConnection`, `acceptConnection`, `declineConnection`, `removeConnection`)
- [ ] Add `updateConnectionGroups` resolver
- [ ] Rewrite `src/lib/services/connectionService.ts` for new model using `initiator`/`recipient`
- [ ] Update `src/lib/services/userService.ts` — connection lookups with new model
- [ ] Rewrite `prisma/seed.ts` — create single Connection records with ConnectionSides
- [ ] Update `pending-connections-table.tsx` and `pending-connection-row.tsx`
- [ ] Update `connections-table.tsx` and `connection-row.tsx`
- [ ] Update `src/app/link/[username]/page.tsx` — connection check with new model
- [ ] Update trait-related code referencing `connection.connectedAccount`
- [ ] Update test fixtures and integration tests
- [ ] Run `yarn lint`
- [ ] Run `yarn run prisma db seed`
