# FEAT-002: Add Connection to Group

---
page: /link
area: connections
priority: medium
status: done
created: 2026-06-21
---

## Summary

The "Add to group" button in `src/app/link/_components/connection-row.tsx:64` is permanently `disabled`. The GraphQL mutations `addConnectionToGroup` and `removeConnectionFromGroup` are fully implemented in resolvers and services. Wire up the button with a dropdown to select groups.

## Motivation

Users can create connection groups and manage traits, but cannot assign connections to those groups. The backend is ready — only the UI wiring is missing.

## Scope

**In scope:**
- Add group selection dropdown to `ConnectionRow`
- Wire up `addConnectionToGroup` / `removeConnectionFromGroup` GraphQL mutations
- Show group membership state in the dropdown

**Out of scope:**
- Bulk group assignment
- Creating groups from the link page

## Design

1. Add `groups` prop and `onAddToGroup` / `onRemoveFromGroup` callbacks to `ConnectionRow`
2. Replace the disabled button with a `DropdownMenu` listing groups with checkmarks for current membership
3. Parent passes `myConnectionGroups` query data and wires mutations
4. After mutation, refetch or optimistically update connection's groups

## Notes

- Button location: `src/app/link/_components/connection-row.tsx:64-66`
- `DropdownMenu` already exists at `src/components/ui/dropdown-menu`
- Mutations exist in `src/lib/graphql/resolvers/connection.ts`

## Agent Instructions

**What to look for:**
The disabled "Add to group" button in `ConnectionRow` and existing GraphQL mutations.

**Files to check:**
- `src/app/link/_components/connection-row.tsx` — replace disabled button with dropdown
- `src/app/link/page.tsx` — pass groups and wire mutations
- `src/lib/graphql/resolvers/connection.ts` — existing `addConnectionToGroup` / `removeConnectionFromGroup` mutations
- `src/components/ui/dropdown-menu` — existing component for group selection UI

**What not to change:**
- Existing GraphQL mutations and resolvers
- Other buttons in the connection row (remove, etc.)

**Verification:**
1. Visit `/link` page, click "Add to group" on a connection
2. Select a group from the dropdown — connection should be added
3. Reopen dropdown — group should show as checked
4. Run `yarn lint`

## Tasks

- [ ] Add `groups` prop to `ConnectionRow`
- [ ] Replace disabled button with `DropdownMenu` with group checkmarks
- [ ] Wire `addConnectionToGroup` / `removeConnectionFromGroup` mutations in parent
- [ ] Run `yarn lint`

---

*Migrated from plan [01c-implement-add-connection-to-group](../plans/01c-implement-add-connection-to-group.md).*
