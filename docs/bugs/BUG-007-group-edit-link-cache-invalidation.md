# BUG-007: Editing a group doesn't invalidate the /link page cache

---
page: /groups
area: cache-invalidation
severity: medium
status: open
created: 2026-06-22
---

## Observed Behavior

When a group is edited via the `/groups` page (rename, add/remove connections or traits), the `/link` page continues to show stale connection group data. Changes to group names and membership only appear on `/link` after a full page refresh.

## Expected Behavior

Editing a group on `/groups` should immediately reflect on the `/link` page without requiring a manual refresh. The `/link` connections table should show updated group names and membership.

## Notes

**Root cause: missing cross-page cache invalidation.**

The edit flow:
1. `updateGroupAction` in `src/app/groups/actions.ts` updates the DB and calls `revalidatePath("/groups")` — this only invalidates the Next.js RSC cache for `/groups`.
2. The `/link` page (`connections-table.tsx`) fetches data via urql `useQuery` with default `cache-first` policy. This urql cache is never purged when a group is edited.
3. The `edit-group-dialog.tsx` simply closes the dialog after save — no router refresh, no urql cache purge.

Two caches go stale:
- **Next.js RSC cache for `/link`**: The `/link` page is a server component with no `dynamic` export. `revalidatePath("/link")` is never called.
- **urql `cacheExchange` in-memory cache**: `useQuery` uses default `cache-first`, so previously-fetched `myConnections` and `myConnectionGroups` are served from memory even after navigation to `/link`.

Compare this with in-page group changes on `/link` (add/remove from group), which correctly call `reexecute()` after each mutation.

**Key files:**
- `src/app/groups/actions.ts` — only `revalidatePath("/groups")`, missing `/link`
- `src/app/link/_components/connections-table.tsx` — urql queries with default `cache-first`, no `requestPolicy` override
- `src/components/graphql-provider.tsx` — urql client config with `cacheExchange`

## Fix

1. Add `revalidatePath("/link")` to `updateGroupAction` (and `createGroupAction`, `deleteGroupAction`) to invalidate the RSC cache.
2. Optionally, set `requestPolicy: 'cache-and-network'` on the urql queries in `connections-table.tsx` to ensure fresh data fetches on mount.

## Agent Instructions

**What to look for:**
- `revalidatePath` calls in `groups/actions.ts` — currently only revalidates `/groups`
- urql `useQuery` in `connections-table.tsx` — uses default `cache-first`

**Files to check:**
- `src/app/groups/actions.ts`
- `src/app/link/_components/connections-table.tsx`

**What not to change:**
- `pending-connections-table.tsx` — pending connections are not affected by group edits
- GraphQL resolvers or service layer
- `updateGroupAction` logic — only add cache invalidation, don't modify the update logic

**Verification:**
- After editing a group on `/groups` (rename, change connections or traits), navigate to `/link`
- The connections table shows the updated group names and membership
- No manual page refresh required

## Tasks

- [ ] Add `revalidatePath("/link")` to `updateGroupAction` in `src/app/groups/actions.ts`
- [ ] Add `revalidatePath("/link")` to `createGroupAction` in `src/app/groups/actions.ts`
- [ ] Add `revalidatePath("/link")` to `deleteGroupAction` in `src/app/groups/actions.ts`
