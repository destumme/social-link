# BUG-001: Connections not updated on group edit + group reorder after edit

---
page: /groups
area: connection groups
severity: medium
status: open
created: 2026-06-21
---

## Observed Behavior

- Connections are not being updated when a group is edited.
- Groups reorder in the view on the page after editing a group.

## Expected Behavior

- Editing a group should update its associated connections.
- Groups should remain in the same order after editing — editing should not cause a reorder.

## Notes

**Root cause identified (2026-07-12):** `updateConnectionGroup` in `connectionGroupService.ts` tries to set `updateData.connections`, but the `ConnectionGroup` Prisma model has no `connections` field — it has `sides: ConnectionSide[]` instead. The `ConnectionSide` model links connections to groups via a many-to-many through table with a compound key (`connectionId` + `accountId`). Setting connection IDs directly on the group is not possible through Prisma's relation API — the service needs to manage `ConnectionSide` records instead.

*Supersedes plan [01d-persist-connection-toggles-edit-group](../plans/01d-persist-connection-toggles-edit-group.md).*

## Agent Instructions

**What to look for:**

- `updateConnectionGroup` in `connectionGroupService.ts` (lines 41-64): sets `updateData.connections` but `ConnectionGroup` model has `sides`, not `connections`. The fix must work through `ConnectionSide` records.
- `ConnectionSide` model has a compound unique key (`connectionId`, `accountId`), so setting connections requires creating/updating `ConnectionSide` rows, not a simple `set` on the group.
- How groups are sorted on the page and whether the sort key changes after an edit (e.g. `updatedAt` bumping causing a re-sort).

**Files to check:**

- `src/lib/services/connectionGroupService.ts` — `updateConnectionGroup` function (root cause)
- `src/app/groups/actions.ts` — `updateGroupAction` passes `connectionIds` to the service
- `src/app/groups/_components/edit-group-dialog.tsx` — UI sends `connectionIds` on save
- `src/app/groups/page.tsx` — data fetching and group ordering
- `prisma/schema.prisma` — `ConnectionGroup` has `sides`, not `connections`

**What not to change:**

- Do not change the group data model without confirming it's necessary.

**Verification:**

- Edit a group and confirm connections reflect the changes.
- Edit a group and confirm the visual order of groups does not change.

## Tasks

- [x] Investigate connection update flow on group edit — root cause found
- [ ] Investigate group sort/order behavior after edit
- [ ] Implement fix for connection updates (rewrite `updateConnectionGroup` to manage `ConnectionSide` records)
- [ ] Implement fix for group reorder
