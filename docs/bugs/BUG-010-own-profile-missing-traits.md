# BUG-010: Own profile page returns 404 or hides private traits

---
page: /link/[username]
area: trait visibility
severity: high
status: open
created: 2026-07-13
---

## Observed Behavior

When a logged-in user navigates to their own profile page (`/link/[their-username]`), two problems occur depending on their `publicListed` setting:

1. **If `publicListed` is false:** `findUserWithTraitsByUsername` returns `null` because the viewer is not "connected" to themselves (the connection check fails), and the function then checks `publicListed` — which is false — so it returns `null`. The page calls `notFound()` and the user gets a 404 on their own profile.

2. **If `publicListed` is true:** The function proceeds but treats the owner as an unconnected viewer, so only traits with `isVisible: true` are returned. The user cannot see their own private traits on their profile page.

## Expected Behavior

When viewing your own profile:
- The page should always load regardless of `publicListed` setting.
- All of the user's own traits should be displayed (both visible and non-visible).

## Notes

The profile page (`src/app/link/[username]/page.tsx:55`) already computes `isSelfVisit = authedAccountId === user.id` for UI purposes (hiding connect/disconnect buttons), but `findUserWithTraitsByUsername` has no equivalent owner check — it only distinguishes between unauthenticated, unconnected, and connected viewers.

The relevant code path in `findUserWithTraitsByUsername` (`src/lib/services/userService.ts:38-101`):

```
viewerId obtained → user found → connection check → isConnected = false (no self-connection)
  → publicListed check → if false: return null (BUG: 404)
  → if true: filter to isVisible: true only (BUG: hides private traits)
```

There is no branch for `viewerId === user.id`.

## Fix

Add an early return in `findUserWithTraitsByUsername` when `viewerId === user.id`. In that case, return the user with **all** their traits (no visibility filter). This should be checked before the connection lookup to also skip the unnecessary query.

## Agent Instructions

**What to look for:**
- The lack of an owner/self-visit check in `findUserWithTraitsByUsername`.
- The function should return all traits when the viewer is the profile owner.

**Files to check:**
- `src/lib/services/userService.ts` — `findUserWithTraitsByUsername` (lines 38-101)
- `src/app/link/[username]/page.tsx` — confirms the page relies on this function and already detects self-visits at line 55

**What not to change:**
- The profile page component logic or layout
- Visibility logic for non-owner viewers (already fixed by BUG-008)
- The `findUserTraitsForViewer` resolver (separate code path)

**Verification:**
1. As User A with `publicListed: false`, visit `/link/[your-username]` — page should load with all traits
2. As User A with `publicListed: true`, visit own profile — all traits (including non-visible) should appear
3. As User B (not connected), visit User A's profile — should still only see `isVisible: true` traits
4. As a connected user, visit User A's profile — should see visible + group-shared traits (unchanged)
5. `yarn build` passes
6. `yarn lint:fix` passes

## Tasks

- [ ] Add owner check (`viewerId === user.id`) in `findUserWithTraitsByUsername` before the connection lookup
- [ ] Return all traits (no visibility filter) for the owner path
- [ ] Verify with build and lint
