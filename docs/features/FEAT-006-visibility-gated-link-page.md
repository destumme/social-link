# FEAT-006: Visibility-gated link page with trait filtering

---
page: /link/[username]
area: connections / traits
priority: medium
status: proposed
created: 2026-06-21
---

## Summary

Update `/link/[username]` to enforce visibility rules: only show `publicListed` users (or connected users), filter traits by connection group membership, and reorganize the header row with "Connected" badge and "Remove Connection" button at top right.

## Motivation

Currently the page:
- Shows **all** traits unconditionally (ignores `visibleGroups`)
- Shows every user regardless of `publicListed` status
- Renders the "Connected" badge and "Remove Connection" button below the traits card, far from the connection action area
- Has no distinction between public traits and group-restricted traits

## Scope

**In scope:**
- Add `isVisible` field to the `Trait` model (Prisma schema + GraphQL type)
- Restrict page to `publicListed: true` users OR users connected to the viewer
- Filter traits: non-connected viewers see only traits with `isVisible: true` (public); connected viewers see public + group-visible traits
- Allow editing `isVisible` for a trait via the edit trait dialog
- Move "Connected" badge to top right header row (same row as display name / @username)
- Move "Remove Connection" button next to "Connected" badge
- Show "Request Connection" button for non-connected public users
- Show "Pending" badge for pending connections

**Out of scope:**
- Changing the `Trait.visibleGroups` data model
- Editing trait visibility from the link page
- The connection pair request/remove server actions (already implemented)

## Design

### Data model: `Trait.isVisible`

Add `isVisible Boolean @default(false)` to the `Trait` model. This replaces the implicit "empty `visibleGroups` = public" heuristic with an explicit field.

A trait is considered **public** when `isVisible: true`. A trait with `isVisible: false` is only visible to connected viewers who are members of at least one of the trait's `visibleGroups`.

### Data fetching changes

1. **User lookup**: add `publicListed: true` filter to `findUserWithTraitsByUsername`, with an exception for connected users. If the viewer is connected to the target, show the user even if not `publicListed`.

2. **Trait filtering** — replace unconditional `include: { traits: true }` with filtered fetch:
   - Viewer NOT connected: `where: { isVisible: true }` (only public traits)
   - Viewer IS connected: `where: { OR: [{ isVisible: true }, { visibleGroups: { some: { connections: { some: { accountId: viewerId } } } } }] }` (public OR group-visible)

### Edit trait dialog: `isVisible` toggle

Add a `Switch` to `src/app/traits/_components/edit-trait-dialog.tsx` labeled "Publicly visible" that edits `isVisible`. When toggled on, the trait appears to all visitors on the link page. When off, it's only visible to connected viewers in the trait's groups.

**Constraint**: A trait can only be `isVisible: true` if the user's `publicListed` is `true`. Enforcement:
- **UI**: disable the "Publicly visible" toggle when `publicListed` is `false`, with a helper message like "Enable public profile in Settings to make traits visible"
- **Server**: the `updateTrait` service/action must reject or coerce `isVisible: true` when the owner's `publicListed` is `false`
- **Trait filtering** on the link page already requires `publicListed: true` on the user, so a non-public user's traits would never appear regardless of `isVisible` — but the server-side guard prevents data inconsistency

### UI layout changes

Before:
```
┌──────────────────────────────────────────┐
│  Display Name          [Request / Pending]│
│  @username                                │
├──────────────────────────────────────────┤
│  [Traits Table]                          │
├──────────────────────────────────────────┤
│  [Connected]  [Remove Connection]        │
└──────────────────────────────────────────┘
```

After:
```
┌──────────────────────────────────────────┐
│  Display Name          [Connected] [Remove]│
│  @username                                │
│                     OR                    │
│  Display Name     [Request Connection]     │
│  @username                                │
│                     OR                    │
│  Display Name          [Pending]          │
│  @username                                │
├──────────────────────────────────────────┤
│  [Traits Table] (filtered)               │
└──────────────────────────────────────────┘
```

All connection actions (badge, remove, request) live in the top right area of the header row.

## Notes

- Page file: `src/app/link/[username]/page.tsx` (150 lines)
- Trait model: `src/app/traits/_components/edit-trait-dialog.tsx` (218 lines)
- Prisma schema: `prisma/schema.prisma` — Trait model at line 55
- GraphQL types: `src/lib/graphql/typeDefs.ts` — Trait type at line ~52
- Current user service: `userService.search.findUserWithTraitsByUsername` at `src/lib/services/userService.ts:15-21` — returns ALL traits, no `publicListed` filter
- Trait service: `src/lib/services/traitService.ts` — `updateTrait` needs `isVisible` support
- Trait actions: `src/app/traits/actions.ts` — `updateTraitAction` needs `isVisible` support
- Existing visibility function (unused by page): `findUserTraitsForViewer` at `src/lib/services/userService.ts:52-69` — filters by `visibleGroups` but requires auth
- Connection status: `connectionService.search.findConnectionBetweenAccounts` at `src/lib/services/connectionService.ts:32-37` — already works
- "Connected" badge currently at line 131 (below traits card)
- "Remove Connection" button currently at line 136 (below traits card)
- "Request Connection" button already in header row (line 100)
- "Pending" badge already in header row (line 105)

## Agent Instructions

**What to look for:**
The page component that fetches all traits unconditionally and renders the "Connected" badge below the traits table.

**Files to check:**
- `prisma/schema.prisma` — add `isVisible` field to Trait model
- `src/lib/graphql/typeDefs.ts` — add `isVisible` to Trait GraphQL type
- `src/lib/services/traitService.ts` — update `updateTrait` to accept `isVisible`
- `src/lib/services/userService.ts` — update `findUserWithTraitsByUsername` with `isVisible` filtering
- `src/app/traits/actions.ts` — update `updateTraitAction` to pass `isVisible`
- `src/app/traits/_components/edit-trait-dialog.tsx` — add `isVisible` toggle
- `src/app/link/[username]/page.tsx` — refactor visibility logic and UI layout
- `src/lib/services/connectionService.ts` — existing `findConnectionBetweenAccounts` (no changes needed)

**What not to change:**
- `requestConnectionAction` and `removeConnectionAction` server actions (already correct)
- The traits table rendering on the link page (layout stays, only data changes)
- The `Trait.visibleGroups` data model

**Verification:**
1. Edit a trait when user is `publicListed: true` → toggle "Publicly visible" on/off → confirm it saves
2. Set user to `publicListed: false` in Settings → edit a trait → "Publicly visible" toggle is disabled with helper text
3. Visit `/link/{publicUser}` as unconnected viewer → only `isVisible: true` traits shown, "Request Connection" button visible
4. Connect to that user, revisit page → public + group-visible traits shown, "Connected" badge and "Remove Connection" at top right
5. Set a user to `publicListed: false`, try to visit as unconnected → 404
6. Connect to a non-public user, revisit → page works (connected exception)
7. Run `yarn prisma db push` to apply schema change
8. Run `yarn lint`

## Tasks

- [ ] Add `isVisible Boolean @default(false)` to Trait model in `prisma/schema.prisma`
- [ ] Run `yarn prisma generate` and `yarn prisma db push`
- [ ] Add `isVisible` to Trait GraphQL type in `src/lib/graphql/typeDefs.ts`
- [ ] Update `traitService.trait.updateTrait` to accept `isVisible`, reject if `publicListed: false`
- [ ] Update `updateTraitAction` in `src/app/traits/actions.ts` to pass `isVisible`
- [ ] Add `isVisible` toggle to edit trait dialog, disabled when `publicListed: false` with helper text
- [ ] Add `publicListed` check to user lookup (exception for connected viewers)
- [ ] Implement trait visibility filtering using `isVisible` + `visibleGroups`
- [ ] Move "Connected" badge from below traits card to top right header row
- [ ] Move "Remove Connection" button next to "Connected" badge in header row
- [ ] Ensure "Request Connection" button shows for non-connected public users
- [ ] Ensure "Pending" badge still shows for pending connections
- [ ] Run `yarn lint`
