# BUG-003: Dead "Rename" button on connection groups page

---
page: /groups
area: connection groups
severity: low
status: resolved
created: 2026-06-21
---

## Observed Behavior

Each group row in the groups table renders a disabled "Rename" button next to Edit and Delete. The button is permanently disabled (`disabled` prop, no `onClick` handler) and serves no purpose.

## Expected Behavior

The button should be removed. There is no rename functionality planned, and a permanently disabled button is dead UI that confuses users.

## Notes

In `src/app/groups/_components/group-table.tsx:83-85`:

```tsx
<Button variant="ghost" size="sm" disabled>
  Rename
</Button>
```

*Supersedes plan [01b-implement-group-rename-button](../plans/01b-implement-group-rename-button.md).*

## Agent Instructions

**What to look for:**

- Remove the disabled `<Button>` on lines 83-85 in `group-table.tsx`.

**Files to check:**

- `src/app/groups/_components/group-table.tsx`

**What not to change:**

- Do not remove the Edit or Delete buttons.
- Do not add a rename dialog or form.

**Verification:**

- Visit `/groups` — the Rename button should no longer appear in any group row.
- Edit and Delete buttons should still be present and functional.

## Tasks

- [ ] Remove the disabled Rename button from group-table.tsx
