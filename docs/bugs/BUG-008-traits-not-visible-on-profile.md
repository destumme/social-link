# BUG-008: Traits not visible to connected users on profile page

---
page: /link/[username]
area: trait visibility
severity: high
status: open
created: 2026-07-12
---

## Observed Behavior

When a logged-in user views another user's profile, traits that should be visible via connection group membership are not displayed. Only publicly visible traits (`isVisible: true`) appear.

Two separate code paths are affected:

1. **Profile page** (`findUserWithTraitsByUsername`): The visibility query checks `visibleGroups.some.sides.some.accountId = viewerId`, but `addConnectionToGroup` adds the **owner's** `ConnectionSide` (where `accountId = owner`) to the group, not the viewer's side. So the viewer's `accountId` will never match a side in the group.

2. **GraphQL resolver** (`findUserTraitsForViewer`): The query is completely backwards -- it looks for groups owned by the **viewer** (`accountId: viewerUserId`) with the target user as a side member. It should look for groups owned by the **target user** with the viewer's connection as a side member. It also omits publicly visible (`isVisible: true`) traits entirely.

## Expected Behavior

When viewing another user's profile:
- Publicly visible traits (`isVisible: true`) should always appear.
- Traits assigned to connection groups that contain the shared connection between the viewer and the profile owner should also appear.

## Notes

### Root cause: side ownership mismatch

`addConnectionToGroup` at `src/lib/services/connectionService.ts:150` finds the side via:
```ts
connectionId_accountId: { connectionId, accountId }  // accountId = logged-in user (group owner)
```

This adds the **owner's side** to the group. But the profile page visibility query at `src/lib/services/userService.ts:56-63` checks:
```ts
visibleGroups: { some: { sides: { some: { accountId: viewerId } } } }
```

The viewer's `accountId` won't match because the group contains the owner's side, not the viewer's side.

### `findUserTraitsForViewer` is independently broken

At `src/lib/services/userService.ts:105-124`:
```ts
visibleGroups: {
  some: {
    accountId: viewerUserId,   // wrong: checks groups owned by VIEWER
    AND: {
      sides: { some: { accountId: userId } },  // wrong: checks if TARGET is a side
    },
  },
},
```

This should instead find groups owned by the **target user** that have a side representing the connection with the viewer.

## Fix

The visibility queries need to be corrected so they check whether the connection between the viewer and the profile owner is in one of the trait's visible groups. The exact approach depends on which side gets added to groups, but one approach:

- Change the query to check that a `visibleGroup`'s side has a `connection` where either `initiatorId` or `recipientId` matches the viewer.
- Ensure `findUserTraitsForViewer` checks groups owned by the **target user** (not the viewer) and includes `isVisible: true` traits.

## Agent Instructions

**What to look for:**
- How `addConnectionToGroup` determines which `ConnectionSide` to add to a group (owner's side vs. other user's side).
- The visibility filter in `findUserWithTraitsByUsername` -- does it correctly identify whether the viewer's connection is in the trait's visible groups?
- The visibility filter in `findUserTraitsForViewer` -- the group ownership and side checks are reversed.

**Files to check:**
- `src/lib/services/userService.ts` -- `findUserWithTraitsByUsername` (lines 48-70) and `findUserTraitsForViewer` (lines 105-124)
- `src/lib/services/connectionService.ts` -- `addConnectionToGroup` (line 150), `updateConnectionGroups` if it exists
- `src/lib/services/connectionGroupService.ts` -- `updateConnectionGroup` which also sets sides on groups
- `src/app/link/[username]/page.tsx` -- how the profile page renders traits
- `prisma/schema.prisma` -- `ConnectionSide`, `ConnectionGroup`, and `Trait` model relations

**What not to change:**
- The `ConnectionSide` or `ConnectionGroup` data models
- How `addConnectionToGroup` selects which side to add (fix the query, not the mutation)
- Public visibility logic (`isVisible: true` path is correct)

**Verification:**
1. As User A, create a trait and assign it to a connection group (not publicly visible)
2. As User A, add a connection with User B to that group
3. As User B, view User A's profile -- the trait should be visible
4. As User C (not connected or in a different group), view User A's profile -- the trait should NOT be visible
5. Publicly visible traits should still appear for all viewers
6. `yarn build` passes
7. `yarn lint:fix` passes

## Tasks

- [ ] Investigate the correct side-matching logic for visibility queries
- [ ] Fix `findUserWithTraitsByUsername` visibility query in `userService.ts`
- [ ] Fix `findUserTraitsForViewer` query in `userService.ts` (reverse group ownership, add `isVisible` OR)
- [ ] Add test coverage for trait visibility scenarios
- [ ] Verify with manual testing
