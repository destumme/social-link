# FEAT-012: Trait Visibility Audit — ConnectionGroup.sides Migration

---
page: /link, /traits
area: traits / connections / data-model
priority: high
status: proposed
created: 2026-06-28
---

## Summary

Audit and fix all trait visibility filtering queries that traverse `ConnectionGroup.connections` so they work with the new `ConnectionGroup.sides` relation introduced by FEAT-008 (Connection Data Model Refactor). This is a follow-up feature that must be completed after FEAT-008.

## Motivation

FEAT-008 replaces the per-user `Connection` model with a single shared `Connection` + `ConnectionSide` pattern. As part of this change, `ConnectionGroup.connections` becomes `ConnectionGroup.sides`. Any query that traverses `ConnectionGroup.connections` to check trait visibility or group membership will break silently or throw errors. There are **three separate trait visibility queries** in the codebase that reference this relation, and at least one service method that queries groups by connection membership.

## Scope

**In scope:**
- Update `userService.findUserWithTraitsByUsername` — trait visibility `where` clause
- Update `userService.findUserTraitsForViewer` — trait visibility `where` clause
- Update `connectionService.findGroupsForConnection` — group lookup by connection
- Update GraphQL resolvers that resolve `ConnectionGroup.connections`
- Update any additional code that traverses `ConnectionGroup.connections`
- Verify trait visibility works correctly on `/link/[username]` and `/traits` pages

**Out of scope:**
- Changing trait visibility logic beyond the `ConnectionGroup` relation path
- FEAT-010 (individual `visibleConnections` on traits) — that feature's own schema changes are separate
- Migration of production data (no production yet)
- UI changes (no component changes needed if queries are correct)

## Design

### Affected queries

#### 1. `findUserWithTraitsByUsername` (`src/lib/services/userService.ts:40-62`)

Current trait visibility filter for connected viewers:
```ts
OR: [
  { isVisible: true },
  {
    visibleGroups: {
      some: {
        connections: {
          some: {
            accountId: viewerId,
          },
        },
      },
    },
  },
],
```

After FEAT-008, `ConnectionGroup.connections` → `ConnectionGroup.sides`:
```ts
OR: [
  { isVisible: true },
  {
    visibleGroups: {
      some: {
        sides: {
          some: {
            accountId: viewerId,
          },
        },
      },
    },
  },
],
```

#### 2. `findUserTraitsForViewer` (`src/lib/services/userService.ts:95-113`)

Current query:
```ts
visibleGroups: {
  some: {
    accountId: viewerUserId,
    AND: {
      connections: {
        some: {
          accountId: userId,
        },
      },
    },
  },
},
```

After FEAT-008, the `connections` traversal becomes `sides`:
```ts
visibleGroups: {
  some: {
    accountId: viewerUserId,
    AND: {
      sides: {
        some: {
          accountId: userId,
        },
      },
    },
  },
},
```

#### 3. `findGroupsForConnection` (`src/lib/services/connectionService.ts:227-231`)

Current query:
```ts
prisma.connectionGroup.findMany({
  where: { connections: { some: { id: connectionId } } },
});
```

After FEAT-008, this needs to query `ConnectionSide` by `connectionId` instead of `Connection` directly:
```ts
prisma.connectionGroup.findMany({
  where: { sides: { some: { connectionId } } },
});
```

Note: The parameter semantics change too — callers currently pass a `Connection.id`, but after FEAT-008 they should pass a `ConnectionSide.id` or the shared `Connection.id` (depending on how the caller is updated).

#### 4. GraphQL `ConnectionGroup.connections` resolver

Check `src/lib/graphql/resolvers/connectionGroup.ts` for any resolver that resolves the `connections` field on `ConnectionGroup`. This field may be renamed to `sides` in the GraphQL schema (per FEAT-008), or the resolver may need updating to traverse `sides` → `ConnectionSide` → `Connection` → `User` if the GraphQL type still exposes a `connections` field for backward compatibility.

### Verification approach

After FEAT-008 is merged:
1. Seed the database with the new model
2. As Alice, set a trait visible only to "Close Friends" group
3. Add Bob to Alice's "Close Friends" group (via `ConnectionSide`)
4. Visit `/link/alice` as Bob → trait should be visible
5. Visit `/link/alice` as Charlie (not in group) → trait should NOT be visible
6. As Alice, visit `/traits` → confirm group badges display correctly
7. Run existing test suite — all trait visibility tests should pass

## Notes

- This feature **depends on FEAT-008** being completed first.
- FEAT-010 (individual connection traits) also depends on FEAT-008 but is a separate feature — do not implement FEAT-010 changes here.
- The `ConnectionGroup` model itself doesn't change structurally — only the relation name from `connections` to `sides`.
- No UI components need changes if the service-layer queries return the same shape.

## Agent Instructions

**What to look for:**
All Prisma queries that traverse `ConnectionGroup.connections` or reference `Connection` in the context of trait visibility filtering. Also check GraphQL resolvers for `ConnectionGroup`.

**Files to check:**
- `src/lib/services/userService.ts` — `findUserWithTraitsByUsername` (line 40), `findUserTraitsForViewer` (line 95)
- `src/lib/services/connectionService.ts` — `findGroupsForConnection` (line 227)
- `src/lib/graphql/resolvers/connectionGroup.ts` — `connections` field resolver
- `src/lib/graphql/resolvers/trait.ts` — `visibleGroups` resolver
- `src/lib/graphql/typeDefs.ts` — `ConnectionGroup` type definition
- `src/tests/integration/graphql/trait.test.ts` — trait visibility tests
- `src/tests/integration/graphql/user.test.ts` — user/trait filtering tests
- `src/tests/unit/lib/services/userService.test.ts` — unit tests for trait filtering

**What not to change:**
- Trait model, `isVisible` field, or `visibleGroups` relation (these stay the same)
- FEAT-010's `visibleConnections` changes (separate feature)
- Any UI components — only service-layer and resolver changes needed
- GraphQL mutations for groups (`addTraitToGroup`, `removeTraitFromGroup`)

**Verification:**
1. Confirm FEAT-008 is merged and `ConnectionGroup.sides` exists in the schema
2. Run `yarn run prisma generate`
3. Run `yarn run prisma db seed`
4. As a group member, visit `/link/{username}` → confirm group-visible traits appear
5. As a non-member, visit `/link/{username}` → confirm group-visible traits do NOT appear
6. As the trait owner, visit `/traits` → confirm group badges display correctly
7. Run `yarn lint`
8. Run existing test suite — all tests should pass

## Tasks

- [ ] Update `findUserWithTraitsByUsername` trait visibility filter: `connections` → `sides`
- [ ] Update `findUserTraitsForViewer` trait visibility filter: `connections` → `sides`
- [ ] Update `findGroupsForConnection` to query `ConnectionGroup.sides` instead of `connections`
- [ ] Update GraphQL `ConnectionGroup` type/resolver for `sides` relation
- [ ] Review all other code for remaining `ConnectionGroup.connections` references
- [ ] Update integration tests for trait visibility
- [ ] Update unit tests for trait filtering
- [ ] Run `yarn lint`
- [ ] Run test suite

## Agent Instructions: When Completing a Feature

After implementing the feature:
1. Change `status: proposed` (or `in_progress`) to `status: done` in this file's YAML frontmatter.
2. Move the entry from the **Proposed** or **In Progress** table to the **Done** table in [docs/features/index.md](index.md), replacing the `—` placeholder with the feature ID, title, priority, and today's date.
