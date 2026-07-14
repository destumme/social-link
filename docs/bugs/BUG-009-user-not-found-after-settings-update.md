# BUG-009: User not found after changing display name and username in settings

---
page: /settings, /link/[username]
area: user search / settings
severity: high
status: resolved
created: 2026-07-12
---

## Observed Behavior

After a user changes their display name and/or username in the settings page, they can no longer be found via search or direct profile URL. Existing links to `/link/[old-username]` return 404, and search queries may fail to locate the updated user.

## Expected Behavior

- After updating username, the user should be findable by their new username.
- Search should match against the new display name and username.
- Ideally, old profile URLs should gracefully handle the change (redirect or informative message).

## Notes

### Multiple contributing issues identified:

**1. `contains` instead of `equals` in user lookups**

Both `findUsersByUsername` (`userService.ts:75`) and `findUserWithTraitsByUsername` (`userService.ts:20`) use `contains` (substring match) instead of `equals` for username lookups. This causes ambiguous matches -- `userByUsername` returns `users[0]` (first arbitrary match), which may be the wrong user. The profile page `findUserWithTraitsByUsername` also uses `contains` instead of an exact match for what should be a direct username lookup.

**2. Case-sensitive matching on PostgreSQL**

Both functions use `mode: "default"`, which is case-sensitive on PostgreSQL. If a user changes their username capitalization (e.g., "Dan" to "dan"), URLs or searches with the old casing will fail.

**3. `publicListed` filter on `userByUsername`**

The `userByUsername` GraphQL resolver calls `findUsersByUsername`, which filters on `publicListed: true`. If a user sets `publicListed: false` in the same settings update, they become completely unfindable via the `userByUsername` query.

**4. No cache invalidation after settings update**

The settings form (`account-form.tsx`) updates via a client-side GraphQL mutation with no `revalidatePath` or `revalidateTag` call. If Next.js caches the `/link/[username]` route, stale data (or a stale 404) could persist after a username change.

**5. Old profile URLs break with no fallback**

After a username change, `/link/[old-username]` returns 404. There is no redirect mechanism or alias lookup to handle this.

## Agent Instructions

**What to look for:**
- How `findUsersByUsername` and `findUserWithTraitsByUsername` query for users -- `contains` vs `equals`, case sensitivity.
- Whether `userByUsername` should use a separate exact-match function instead of reusing the search function.
- Whether the settings update mutation triggers any server-side cache invalidation.
- The `displayUsername` field on the `User` model (`prisma/schema.prisma`) -- it exists but is never used in any service or resolver.

**Files to check:**
- `src/lib/services/userService.ts` -- `findUsersByUsername` (line 75), `findUserWithTraitsByUsername` (line 15), `updateUser` (line 87)
- `src/lib/graphql/resolvers/user.ts` -- `userByUsername` and `searchUsers` resolvers
- `src/app/settings/_components/account-form.tsx` -- mutation call, missing cache invalidation
- `src/app/link/[username]/page.tsx` -- profile page user lookup
- `prisma/schema.prisma` -- `User` model, `username` unique constraint, `displayUsername` field

**What not to change:**
- The `User` data model (unless addressing the unused `displayUsername` field)
- Authentication or session handling
- The settings form UI layout

**Verification:**
1. Change username in settings -- user is findable by new username immediately
2. Search by new display name -- user appears in results
3. Visit `/link/[new-username]` -- profile loads correctly
4. Visit `/link/[old-username]` -- handled gracefully (redirect or message)
5. `yarn build` passes
6. `yarn lint:fix` passes

## Tasks

- [ ] Investigate and fix `findUserWithTraitsByUsername` to use exact match for profile page lookups
- [ ] Separate `userByUsername` (exact match) from `searchUsers` (substring match)
- [ ] Address case sensitivity in username lookups
- [ ] Add cache invalidation after settings update
- [ ] Consider handling old username URLs
- [ ] Add test coverage
