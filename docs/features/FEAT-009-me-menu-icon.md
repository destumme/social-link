# FEAT-009: "Me" menu icon linking to user's own public link page

---
page: header
area: navigation / user profile
priority: medium
status: proposed
created: 2026-06-28
---

## Summary

Add a "Me" icon (user avatar or person icon) to the header that navigates the authenticated user to their own public link page at `/link/[username]`. The page should render exactly as it does for any public visitor — showing only publicly displayable traits (`isVisible: true`), with no connection actions or private/group-restricted traits.

## Motivation

Currently there is no quick way for a logged-in user to preview what their own public link page looks like to others. Users must manually type or copy their username into the URL to see their public profile. A "Me" icon provides one-click access and lets users verify their public-facing information.

## Scope

**In scope:**
- Add a "Me" icon (e.g., `UserCircle01Icon` from Hugeicons) to the header, visible only when authenticated
- The icon navigates to `/link/[current-user-username]`
- The target page shows only publicly visible traits (`isVisible: true`), identical to how an unconnected public visitor would see it
- No connection actions (Request/Remove Connection) should appear on the self-view
- No "Connected" or "Pending" badges should appear on the self-view

**Out of scope:**
- Changing the existing `/link/[username]` page behavior for other viewers
- Adding any new UI elements to the link page itself
- Editing or managing traits from the link page
- Changing trait visibility rules

## Design

### Header: "Me" icon

Add a user icon button to the right side of the header (`src/components/layout/header.tsx`). The icon should:
- Only render when the user is authenticated (check via `getAuthedAccountId` or a client-side auth check)
- Use a consistent icon from the existing Hugeicons set (e.g., `UserCircle01Icon` or `UserIcon`)
- Link to `/link/{username}` where `username` is the current user's username

Since the header is a client component (`"use client"`), fetching the current user's username requires one of:
1. **Server component wrapper**: Create a server component that fetches the username and passes it as a prop to a client-side icon button
2. **Client-side fetch**: Use a client-side hook or action to get the username on mount
3. **Session data**: If the username is available in the Better Auth session, read it from the session context

The preferred approach is to check if the username is available in the session object from Better Auth. If not, use a small server component to fetch it.

### Link page: self-view behavior

When a user visits their own `/link/[username]` page, the existing page at `src/app/link/[username]/page.tsx` should be updated to detect self-visits and:
- Hide the "Request Connection" button
- Hide the "Remove Connection" button
- Hide the "Connected" and "Pending" badges
- Show only traits where `isVisible: true` (public traits only), regardless of connection status

This is achieved by comparing the page's `username` param against the authenticated user's username (or ID via `getAuthedAccountId`). If they match, treat the viewer as a public, non-connected visitor for rendering purposes.

### Data model

No schema changes required. The existing `isVisible` and `publicListed` fields handle the visibility logic.

## Notes

- Header component: `src/components/layout/header.tsx` (24 lines, client component)
- Link page: `src/app/link/[username]/page.tsx` (163 lines)
- Auth helper: `src/lib/auth-server.ts` — `getAuthedAccountId()` returns the current user's ID
- User service: `src/lib/services/userService.ts` — `findUserById` can fetch the current user to get their username
- Visibility logic: `src/lib/services/userService.ts:40-62` — traits are filtered by `isVisible: true` for non-connected viewers
- The page already uses `connectionService.search.findConnectionBetweenAccounts` to determine connection status; for self-view, this should be bypassed
- Session object structure is defined in `src/lib/auth.ts` — check if `username` is included in the session payload

## Agent Instructions

**What to look for:**
- How to get the current user's username in a client component (header)
- How to detect a self-visit on the `/link/[username]` page
- The existing visibility filtering logic that already handles non-connected viewers

**Files to check:**
- `src/components/layout/header.tsx` — add the "Me" icon button
- `src/lib/auth.ts` — check session structure for username availability
- `src/lib/auth-server.ts` — `getAuthedAccountId()` for server-side auth checks
- `src/app/link/[username]/page.tsx` — add self-visit detection and hide connection UI
- `src/lib/services/userService.ts` — existing trait visibility logic (no changes needed, just reference)

**What not to change:**
- The Prisma schema (no new fields needed)
- The GraphQL schema or resolvers
- The trait visibility filtering logic in `userService.ts`
- The behavior of `/link/[username]` for other (non-self) viewers
- The connection request/remove server actions

**Verification:**
1. Log in as a user → see "Me" icon in header
2. Click "Me" icon → navigates to `/link/{your-username}`
3. On your own link page → no "Request Connection", "Remove Connection", "Connected", or "Pending" UI visible
4. On your own link page → only traits with `isVisible: true` are shown (group-restricted traits hidden)
5. Log out → "Me" icon not visible in header
6. Visit another user's `/link/[username]` → connection UI and visibility rules work as before
7. Run `yarn lint`

## Tasks

- [ ] Determine how to get the current user's username in the header (check session or add server fetch)
- [ ] Add "Me" icon button to `src/components/layout/header.tsx`, visible only when authenticated
- [ ] Wire the icon to navigate to `/link/[current-user-username]`
- [ ] Add self-visit detection in `src/app/link/[username]/page.tsx` (compare viewer ID to page user ID)
- [ ] Hide connection UI (Request/Remove buttons, Connected/Pending badges) on self-view
- [ ] Ensure only `isVisible: true` traits are shown on self-view (reuse existing non-connected viewer logic)
- [ ] Run `yarn lint`

## Agent Instructions: When Completing a Feature

After implementing the feature:
1. Change `status: proposed` (or `in_progress`) to `status: done` in this file's YAML frontmatter.
2. Move the entry from the **Proposed** or **In Progress** table to the **Done** table in [docs/features/index.md](index.md), replacing the `—` placeholder with the feature ID, title, priority, and today's date.
