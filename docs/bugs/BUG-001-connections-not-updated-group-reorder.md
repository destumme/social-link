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

To be investigated.

## Agent Instructions

**What to look for:**

- How the group edit mutation/action handles connection updates.
- What the group edit mutation returns and whether the client refetches connection data.
- How groups are sorted on the page and whether the sort key changes after an edit (e.g. `updatedAt` bumping causing a re-sort).

**Files to check:**

- Group edit dialog/component
- Group update GraphQL resolver and mutation
- Group list page and its data fetching

**What not to change:**

- Do not change the group data model without confirming it's necessary.

**Verification:**

- Edit a group and confirm connections reflect the changes.
- Edit a group and confirm the visual order of groups does not change.

## Tasks

- [ ] Investigate connection update flow on group edit
- [ ] Investigate group sort/order behavior after edit
- [ ] Implement fix for connection updates
- [ ] Implement fix for group reorder
