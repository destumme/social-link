# FEAT-010: Show traits to individual connections

---
page: /traits
area: traits / connections
priority: medium
status: proposed
created: 2026-06-28
---

## Summary

Allow users to share individual traits with specific connections directly, without requiring those connections to be placed in a group. Currently, trait visibility is binary: either public (`isVisible: true`) or restricted to members of one or more `visibleGroups`. This feature adds a `visibleConnections` many-to-many relation on `Trait` so that a trait can be shown to selected individual connections alongside (or instead of) group-based visibility.

## Motivation

The group-based visibility model is powerful but requires overhead: to share a trait with one person, the user must create a group, add the connection to it, and then assign the trait to that group. For ad-hoc sharing — e.g., sharing a personal phone number with one colleague, or a home address with a single friend — this is cumbersome. Direct per-connection visibility gives users a simpler, more granular option.

## Scope

**In scope:**
- Add `visibleConnections` many-to-many relation to the `Trait` model (Prisma schema)
- Update the trait visibility filtering logic on `/link/[username]` to include traits where the viewer is in `visibleConnections`
- Update the edit trait dialog to show a multi-select of the user's accepted connections, allowing individual selection
- Update the traits table to display which individual connections a trait is shared with (alongside existing group badges)
- Update GraphQL schema: add `visibleConnections` to `Trait` type, update `UpdateTraitInput` to accept connection IDs
- Update `traitService.updateTrait` and `createTrait` to handle `visibleConnections`

**Out of scope:**
- Changing the existing `visibleGroups` behavior (it continues to work alongside `visibleConnections`)
- Changing the `isVisible` public toggle behavior
- Bulk operations for assigning connections to traits
- Changing the groups management UI
- Changing the link page layout

## Design

### Data model: `Trait.visibleConnections`

Add a many-to-many relation between `Trait` and `Connection`:

```prisma
model Trait {
  // ... existing fields ...
  visibleConnections Connection[]
}

model Connection {
  // ... existing fields ...
  visibleTraits      Trait[]
}
```

A trait is now visible to a viewer if **any** of the following are true:
1. `isVisible: true` (public)
2. The viewer is a member of at least one of the trait's `visibleGroups` (existing behavior)
3. The viewer's `Connection` record is in the trait's `visibleConnections` (new)

### Trait filtering logic (link page)

In `userService.findUserWithTraitsByUsername`, the trait `where` clause becomes:

```
OR: [
  { isVisible: true },
  { visibleGroups: { some: { connections: { some: { accountId: viewerId } } } } },
  { visibleConnections: { some: { id: connectionId } } },
]
```

Where `connectionId` is the ID of the `Connection` record where `accountId = viewerId` and `connectedAccountId = targetUserId`.

### Edit trait dialog: connection multi-select

In `EditTraitDialog`, add a section below the "Publicly visible" toggle:

- A multi-select (e.g., using a combobox or checkbox list) showing all accepted connections
- Each option displays the connection's `displayName` and `@username`
- Selected connections are shown as badges (similar to how `visibleGroups` badges appear in `TraitRow`)
- The connection selector is only enabled when `isVisible: false` (if the trait is public, individual connection selection is irrelevant)

### Traits table: connection badges

In `TraitRow`, add a new column or extend the existing "Visible Groups" column to also show individual connection badges. Options:
- **Option A**: Rename column to "Visible To" and show both group badges (outline variant) and connection badges (secondary variant) side by side
- **Option B**: Add a new "Visible Connections" column between "Visible Groups" and "Actions"

Option A is preferred to avoid widening the table further. Connection badges should be visually distinct from group badges (e.g., `variant="secondary"` with a user icon prefix).

### GraphQL changes

- Add `visibleConnections: [Connection!]!` to the `Trait` type
- Add `visibleConnectionIds: [ID!]` to `UpdateTraitInput` (and `CreateTraitInput` if desired)
- Add a resolver for `Trait.visibleConnections` that fetches the related connections

### Service layer changes

- `traitService.trait.createTrait`: accept `visibleConnectionIds` and connect the relations
- `traitService.trait.updateTrait`: accept `visibleConnectionIds`, validate that each connection belongs to the authenticated user, and set the relations
- Add a helper to fetch the user's accepted connections with their display info for the multi-select

## Notes

- Prisma schema: `prisma/schema.prisma` — Trait model at line 57, Connection model at line 71
- Trait edit dialog: `src/app/traits/_components/edit-trait-dialog.tsx` (243 lines)
- Trait row: `src/app/traits/_components/trait-row.tsx` (86 lines) — currently shows `visibleGroups` badges in column 4
- Trait table: `src/app/traits/_components/trait-table.tsx` (69 lines) — header has 5 columns
- Trait service: `src/lib/services/traitService.ts` (95 lines) — `updateTrait` at line 40
- Visibility filtering: `src/lib/services/userService.ts:40-62` — the `where` clause for trait fetching
- GraphQL types: `src/lib/graphql/typeDefs.ts` — Trait type at line 30, UpdateTraitInput at line 71
- Connection service: `src/lib/services/connectionService.ts` — `findConnectionsByAccountId` at line 15 can fetch accepted connections
- The Connection model already has a relation to User via `connectedAccount`, so we can display connection names
- Current table is 5 columns (Key, Value, Category, Visible Groups, Actions) — adding connection info to the existing "Visible Groups" column keeps it at 5 columns

## Agent Instructions

**What to look for:**
- The Prisma many-to-many relation pattern (see existing `Trait.visibleGroups` ↔ `ConnectionGroup.traits`)
- How `visibleGroups` is currently fetched and displayed in the traits table
- The existing trait visibility filtering in `userService.findUserWithTraitsByUsername`
- How connections are fetched with their associated user data for display

**Files to check:**
- `prisma/schema.prisma` — add `visibleConnections` to Trait, `visibleTraits` to Connection
- `src/lib/services/userService.ts` — update trait filtering `where` clause
- `src/lib/services/traitService.ts` — update `createTrait` and `updateTrait` for `visibleConnectionIds`
- `src/lib/services/connectionService.ts` — add method to fetch accepted connections with user data
- `src/lib/graphql/typeDefs.ts` — add `visibleConnections` to Trait type, `visibleConnectionIds` to inputs
- `src/lib/graphql/resolvers/trait.ts` — add `visibleConnections` resolver
- `src/app/traits/actions.ts` — update `updateTraitAction` and `createTraitAction` to pass `visibleConnectionIds`
- `src/app/traits/page.tsx` — include `visibleConnections` in the trait fetch
- `src/app/traits/_components/trait-table.tsx` — update column header from "Visible Groups" to "Visible To"
- `src/app/traits/_components/trait-row.tsx` — show connection badges alongside group badges
- `src/app/traits/_components/edit-trait-dialog.tsx` — add connection multi-select

**What not to change:**
- The `visibleGroups` behavior or data model
- The `isVisible` public toggle logic
- The groups management UI (`/groups`)
- The link page layout or connection action buttons
- The GraphQL mutations for groups (`addTraitToGroup`, `removeTraitFromGroup`)

**Verification:**
1. Run `yarn prisma generate` and `yarn prisma db push` to apply schema change
2. Edit a trait → see multi-select of accepted connections → select one or more → save → confirm connection badges appear in the table
3. Create a new trait → select individual connections → save → confirm it works
4. Visit `/link/{your-username}` as a connected user → confirm they see traits shared via `visibleConnections`
5. Visit `/link/{your-username}` as a non-connected user → confirm they do NOT see traits shared via `visibleConnections`
6. Confirm existing `visibleGroups` behavior still works (group members still see group-visible traits)
7. Confirm `isVisible: true` traits still show to everyone
8. Run `yarn lint`

## Tasks

- [ ] Add `visibleConnections Connection[]` to Trait and `visibleTraits Trait[]` to Connection in `prisma/schema.prisma`
- [ ] Run `yarn prisma generate` and `yarn prisma db push`
- [ ] Add `visibleConnections: [Connection!]!` to Trait GraphQL type in `typeDefs.ts`
- [ ] Add `visibleConnectionIds: [ID!]` to `UpdateTraitInput` and `CreateTraitInput` in `typeDefs.ts`
- [ ] Add `visibleConnections` resolver in `src/lib/graphql/resolvers/trait.ts`
- [ ] Update `traitService.trait.updateTrait` to accept and set `visibleConnectionIds`
- [ ] Update `traitService.trait.createTrait` to accept and set `visibleConnectionIds`
- [ ] Add service method to fetch accepted connections with user display info
- [ ] Update trait visibility filtering in `userService.findUserWithTraitsByUsername` to include `visibleConnections` check
- [ ] Update `updateTraitAction` and `createTraitAction` to pass `visibleConnectionIds`
- [ ] Update traits page to include `visibleConnections` in trait fetch (with connected account user data)
- [ ] Add connection multi-select to `EditTraitDialog`
- [ ] Update `TraitRow` to show connection badges alongside group badges
- [ ] Update `TraitTable` header from "Visible Groups" to "Visible To"
- [ ] Run `yarn lint`

## Agent Instructions: When Completing a Feature

After implementing the feature:
1. Change `status: proposed` (or `in_progress`) to `status: done` in this file's YAML frontmatter.
2. Move the entry from the **Proposed** or **In Progress** table to the **Done** table in [docs/features/index.md](index.md), replacing the `—` placeholder with the feature ID, title, priority, and today's date.
