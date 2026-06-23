# BUG-005: "Add to group" button should be "Edit groups" with Switch toggles

---
page: /link
area: groups
severity: low
status: open
created: 2026-06-22
---

## Observed Behavior

The "Add to group" button on the connections table uses `DropdownMenuCheckboxItem` components (checkmark indicators) inside a dropdown menu. The button label "Add to group" implies adding only, but the dropdown already supports both adding and removing groups.

## Expected Behavior

The button should be labeled "Edit groups" and use `Switch` toggle components inside the dropdown — matching the toggle pattern used in the edit-group-dialog (`src/app/groups/_components/edit-group-dialog.tsx`). Each group row should show the group name with a Switch on the right that toggles the connection's membership in that group.

## Notes

- The underlying GraphQL mutations (`addConnectionToGroup`, `removeConnectionFromGroup`) already support both operations correctly.
- The checkbox-based `onCheckedChange` handler already dispatches to the correct mutation.
- Only the UI presentation needs updating.

## Fix

1. Rename the `DropdownMenuTrigger` button text from `"Add to group"` to `"Edit groups"`.
2. Replace `DropdownMenuCheckboxItem` with a `<div>` row containing the group name and a `<Switch>` toggle, matching the pattern at `edit-group-dialog.tsx:162-181`.

## Agent Instructions

**What to look for:**
- `DropdownMenuCheckboxItem` usage in `connection-row.tsx`
- `Switch` toggle pattern in `edit-group-dialog.tsx`

**Files to check:**
- `src/app/link/_components/connection-row.tsx`

**What not to change:**
- `connections-table.tsx` — mutations and data flow are already correct
- GraphQL resolvers or service layer

**Verification:**
- The button reads "Edit groups" instead of "Add to group"
- Clicking the button opens a dropdown with group names and Switch toggles
- Toggling a Switch on adds the connection to that group
- Toggling a Switch off removes the connection from that group
- The dropdown also shows "No groups yet" when the user has no groups

## Tasks

- [ ] Rename button label to "Edit groups"
- [ ] Replace DropdownMenuCheckboxItem with Switch toggles inside dropdown content
