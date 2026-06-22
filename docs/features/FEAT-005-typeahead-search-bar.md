# FEAT-005: Typeahead Search Bar

---
page: app-wide (header)
area: search
priority: medium
status: done
created: 2026-06-21
---

## Summary

The header search bar at `src/components/layout/search-input.tsx` is broken — it submits a query on Enter, but silently does nothing when there are no results (zero feedback to the user). Convert it to a typeahead: show matching public usernames in a dropdown as the user types, with click-to-navigate and keyboard navigation.

## Motivation

The current search flow:
1. User types a query and presses Enter
2. Client calls `searchUsers` GraphQL query
3. If results exist, navigates to the first match at `/link/{username}`
4. **If no results, nothing happens — no error, no feedback**

Users cannot see available matches, pick from multiple results, or even know whether the search worked. A real-time typeahead dropdown makes search discoverable and provides immediate feedback (results or "no results").

## Scope

**In scope:**
- Debounced search as the user types (e.g., 300ms delay)
- Dropdown showing matching usernames below the search input
- Click a result to navigate to `/link/{username}`
- Keyboard navigation (arrow keys + Enter, Escape to close)
- Loading indicator while fetching results
- "No results" state when query has no matches
- Search only public users (`publicListed: true` — already enforced by the resolver)

**Out of scope:**
- Searching by `displayName` (resolver searches `username` only — keep as-is)
- Search result avatars
- Search history or recent searches
- Changing the existing GraphQL `searchUsers` query or resolver

## Design

Use the shadcn `Combobox` component (Base UI):

1. Install via `npx shadcn@latest add combobox`
2. Replace the `<form>` + `onSubmit` pattern with `<Combobox items={results}>`
3. Use `ComboboxInput` with `InputGroupAddon` for the search icon (matches existing header style)
4. Debounce the `searchUsers` query as the user types, update `items` with results
5. On item select via Enter or click, navigate to `/link/{username}`
6. `ComboboxEmpty` handles the "No results" state
7. Built-in keyboard navigation (arrow keys, Enter, Escape) comes free

## Notes

- Current file: `src/components/layout/search-input.tsx` (72 lines, fully replace)
- Resolver at `src/lib/graphql/resolvers/user.ts:60-62`, service at `src/lib/services/userService.ts:24-34`
- `searchUsers` already filters `publicListed: true` — no changes needed to ensure public-only search
- The `searchUsers` resolver is intentionally public (no auth check) — this is correct
- `Combobox` docs: [base docs](https://ui.shadcn.com/docs/components/base/combobox), [Base UI API](https://base-ui.com/react/components/combobox#api-reference)
- Header renders it at `src/components/layout/header.tsx:19` with `className="flex-1"`

## Agent Instructions

**What to look for:**
The search input component that currently uses `<form onSubmit>`, calls `searchUsers` via raw `fetch`, and silently does nothing on zero results.

**Files to check:**
- `src/components/layout/search-input.tsx` — replace with Combobox-based component
- `src/components/layout/header.tsx` — verify layout isn't broken
- `src/components/ui/combobox.tsx` — added via `npx shadcn@latest add combobox`

**What not to change:**
- The `searchUsers` GraphQL query/resolver (already filters `publicListed: true`)
- The `publicListed` behavior (already correct)

**Verification:**
1. `yarn dev` → type in the search bar, confirm dropdown appears with matching usernames
2. Click a result → navigate to `/link/{username}`
3. Press Enter with no dropdown interaction → navigate to first result
4. Press Escape → close dropdown
5. Arrow keys → navigate results, Enter to select
6. Type a query with no matches → see "No results"
7. Confirm only public users appear (set a user to `publicListed: false` in Settings, verify they don't show in search)
8. Run `yarn lint`

## Tasks

- [ ] Install: `npx shadcn@latest add combobox`
- [ ] Rewrite `search-input.tsx` using `Combobox` + `ComboboxInput` + `ComboboxList` + `ComboboxItem` + `ComboboxEmpty`
- [ ] Add debounced `searchUsers` query on input change (update `items` prop)
- [ ] On item select, navigate to `/link/{username}`
- [ ] Add `InputGroupAddon` with search icon inside `ComboboxInput` (preserve existing header look)
- [ ] Verify "No results" state via `ComboboxEmpty`
- [ ] Run `yarn lint`
