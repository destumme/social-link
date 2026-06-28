# FEAT-007: Share Links

---
page: /share/[token], /link
area: connections
priority: medium
status: proposed
created: 2026-06-22
---

## Summary

Allow non-public (`publicListed: false`) users to generate one-time share links. A share link uses an opaque token at `/share/<token>` — no username in the URL — letting any logged-in user view a minimal profile page (display name, image, request button) and request a connection. This bypasses the `publicListed` visibility gate without exposing the user's identity in the URL. Links are created and managed from a modal on the user's `/link` (Connections) page.

## Motivation

Currently, non-public users are invisible in search and on their `/link/[username]` page to anyone not already connected. There is no way for a non-public user to selectively invite someone to connect. Share links solve this: a user generates a link with an opaque token, shares it out-of-band (email, DM, QR code, etc.), and the recipient follows it to request a connection — without ever seeing or leaking the username.

## Scope

**In scope:**
- New `ShareLink` Prisma model (multiple links per user, opaque token, expiration, one-time consumption)
- New `/share/[token]` route — dedicated share page, no username in the URL
- GraphQL mutations: `createShareLink`, `revokeShareLink`
- GraphQL query: `myShareLinks` (for the management modal)
- Share link management modal on `/link` page (create, copy, revoke, view active links)
- On the `/share/[token]` page:
  - Bypass `publicListed` restriction — show user to token holder
  - Minimal profile view: display name, profile image, "Request Connection" button
  - No traits shown
  - On request: consume the token, create pending connection, redirect recipient to their own `/link` page
- Profile image rendering on the share page
- Expiration support: configurable duration (e.g., 1 hour, 24 hours, 7 days) when creating a link

**Out of scope:**
- Changing the existing `/link/[username]` page (no share param handling needed there)
- Share link analytics or click tracking
- Email/sms integration for sending share links (user copies the URL manually)
- QR code generation for share links

## Design

### Data model: `ShareLink`

```prisma
model ShareLink {
  id         String    @id @default(uuid())
  token      String    @unique
  account    User      @relation(fields: [accountId], references: [id])
  accountId  String
  expiresAt  DateTime
  consumedBy String?   // account ID of the recipient who used the link
  consumedAt DateTime?
  createdAt  DateTime  @default(now())

  @@index([accountId])
  @@index([token])
}
```

The `token` is an opaque unique code (e.g., `cuid2` or UUID). The `consumedBy` field links to the recipient's account ID. Once set, the link can no longer be used by anyone else. After consumption, the recipient's pending connection serves as their ongoing access to the user's profile.

### GraphQL schema additions

**Types:**
```graphql
type ShareLink {
  id: ID!
  token: String!
  expiresAt: DateTime!
  consumedBy: ID
  consumedAt: DateTime
  createdAt: DateTime!
  url: String!   # computed: /share/<token>
}

type Query {
  myShareLinks: [ShareLink!]!
}

type Mutation {
  createShareLink(expiresInHours: Int!): ShareLink!
  revokeShareLink(shareLinkId: ID!): Boolean!
}
```

The `url` field is computed server-side as `/share/<token>`.

### Share link management modal

Location: a "Share My Profile" button in the header area of the Pending Requests section on `/link`.

The modal shows:
- A list of active (not consumed, not expired) share links, each with:
  - The full URL (read-only, with copy-to-clipboard button)
  - Expiration time ("Expires in 3 hours" or "Expired")
  - A "Revoke" button
- A "Create New Link" section:
  - Expiration duration picker (presets: 1 hour, 24 hours, 7 days; or a custom input)
  - "Generate" button

### `/share/[token]` page

A new route at `src/app/share/[token]/page.tsx`. When a visitor arrives at `/share/<token>`:

1. **Token validation (server-side):**
   - Token must exist
   - Token must not be expired (`expiresAt > now`)
   - Token must not be consumed (`consumedBy` is null)

2. **View rendered (valid token):**
   - Display name and profile image (from `User.image`, fallback avatar if null)
   - "Request Connection" button
   - No traits, no groups, no username — minimal profile only

3. **On "Request Connection":**
   - Call `requestConnection` mutation (existing)
   - Set `consumedBy` and `consumedAt` on the share link
   - Redirect recipient to `/link` where the pending request appears

4. **View rendered (invalid/expired/consumed token):**
   - Show an appropriate message: "Link expired", "Link already used", or "Link not found"

5. **Edge case — recipient revisits after requesting:**
   - Token's `consumedBy` equals visitor's account ID → show "Pending" badge instead of "Request Connection" button, with a link to `/link`

### Profile image support

The `User.image` field already exists in the schema (populated by Better Auth OAuth). The `/share/[token]` page renders it next to the display name. If `image` is null, show a fallback avatar.

## Notes

- Prisma schema: `prisma/schema.prisma` — `User` model at line 31, `publicListed` field at line 40
- Share page (new): `src/app/share/[token]/page.tsx` — new route, no existing code to modify
- Connections page (modal host): `src/app/link/page.tsx` — Pending Requests section where modal button goes
- Pending connections table: `src/app/link/_components/pending-connections-table.tsx` — header row where "Share" button should appear
- GraphQL types: `src/lib/graphql/typeDefs.ts`
- Connection service: `src/lib/services/connectionService.ts` — `requestConnection` already exists

## Agent Instructions

**What to look for:**
The Connections page (`/link`) with the Pending Requests table, and the opportunity for a clean new route at `/share/[token]` that doesn't touch the existing `/link/[username]` page.

**Files to check:**
- `prisma/schema.prisma` — add `ShareLink` model
- `src/app/share/[token]/page.tsx` — new route for share page
- `src/app/share/layout.tsx` — new layout for share route
- `src/lib/graphql/typeDefs.ts` — add ShareLink type and mutations
- `src/lib/services/shareLinkService.ts` — new service for CRUD
- `src/app/link/page.tsx` — add "Share" button to open modal
- `src/app/link/_components/` — new `share-link-modal.tsx` component

**What not to change:**
- `src/app/link/[username]/page.tsx` — no share param handling needed here; the share page is its own route
- Existing connection request/accept/decline mutations (already correct)
- Trait visibility logic (share page shows no traits at all)

**Verification:**
1. Create a share link from the modal → URL in the format `/share/<token>` is generated and copyable (no username in URL)
2. Open the share link in an incognito session as a different logged-in user → see display name, image, and "Request Connection" button (no traits, no username)
3. Click "Request Connection" → redirected to `/link`, pending request appears
4. Revisit the share link as the same recipient → see "Pending" badge instead of request button
5. Try to use the same share link as a third user → link is consumed, get "Link already used" message
6. Wait for link to expire → visiting shows "Link expired" message
7. Revoke a link from the modal → visiting shows "Link no longer valid" message
8. Non-public user visits `/link/[username]` as an unconnected user → still 404 (unchanged behavior)
9. Run `yarn prisma db push` to apply schema change
10. Run `yarn lint`

## Tasks

- [ ] Add `ShareLink` model to `prisma/schema.prisma`
- [ ] Run `yarn prisma generate` and `yarn prisma db push`
- [ ] Create `src/app/share/layout.tsx` (with Header + Main shell)
- [ ] Create `src/app/share/[token]/page.tsx`
- [ ] Add ShareLink GraphQL type and mutations to `src/lib/graphql/typeDefs.ts`
- [ ] Create `src/lib/services/shareLinkService.ts` with CRUD operations
- [ ] Add ShareLink resolvers for `createShareLink`, `revokeShareLink`, `myShareLinks`
- [ ] Create share link management modal component (`src/app/link/_components/share-link-modal.tsx`)
- [ ] Add "Share" button to Pending Requests section header on `/link`
- [ ] Hook up modal to GraphQL mutations and queries
- [ ] Implement token validation and minimal profile rendering on `/share/[token]` page
- [ ] Handle token consumption on connection request (server action)
- [ ] Handle edge cases: expired token, already-consumed token, revoked token, invalid token
- [ ] Render profile image with fallback avatar on share page
- [ ] Run `yarn lint`
