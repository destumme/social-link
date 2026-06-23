# BUG-006: Edit buttons use default variant instead of outline

---
page:
area: theming
severity: low
status: open
created: 2026-06-22
---

## Observed Behavior

Edit buttons on the groups page and traits page use `variant="default"` (filled/solid style), while the "Add to group" button on the `/link` page uses `variant="outline"`.

## Expected Behavior

Edit buttons should use the same outline theming as the "Add to group" button for visual consistency.

## Notes

- `/link` "Add to group" reference: `connection-row.tsx:84` — `<Button variant="outline" size="sm">`
- `/groups` "Edit": `group-table.tsx:76` — `<Button variant="default" size="sm">`
- `/traits` "Edit": `trait-row.tsx:68` — `<Button variant="default" size="sm">`

## Fix

Change `variant="default"` to `variant="outline"` on both edit buttons.

## Agent Instructions

**What to look for:**
- `variant="default"` on Button components that are labeled "Edit"

**Files to check:**
- `src/app/groups/_components/group-table.tsx`
- `src/app/traits/_components/trait-row.tsx`

**What not to change:**
- Other buttons (`DeleteButton`, forms, etc.)
- Button `size` prop — keep `sm`

**Verification:**
- Edit button on `/groups` page is outline-styled, matching the "Add to group" button on `/link`
- Edit button on `/traits` page is outline-styled, matching the "Add to group" button on `/link`

## Tasks

- [ ] Change `variant="default"` to `variant="outline"` on groups page edit button
- [ ] Change `variant="default"` to `variant="outline"` on traits page edit button
