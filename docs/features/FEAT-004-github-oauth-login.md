# FEAT-004: GitHub OAuth Login + Account Linking

---
page: /login, /settings
area: authentication
priority: medium
status: done
created: 2026-06-21
---

## Summary

Add GitHub as a social login provider to the existing Better Auth setup, and allow existing users to link their GitHub account from the Settings page. Covers provider configuration, login page button, settings page linking UI, and account linking safety.

## Motivation

Users currently can only sign up/in with email/password. Adding GitHub OAuth lowers the barrier to entry and provides a more secure login option. Existing users can link GitHub as a secondary login method.

## Scope

**In scope:**
- GitHub OAuth provider in Better Auth config
- "Sign in with GitHub" button on `/login` and create-account pages
- "Connect GitHub" button on `/settings` ConnectedProviders card
- `accountLinking` with `trustedProviders: ["github"]`
- Username generation from GitHub `login`

**Out of scope:**
- Other OAuth providers (Google, Discord, etc.)
- Disconnecting linked providers
- Production GitHub OAuth app (dev-only for now)

## Design

1. Create GitHub OAuth App with callback `http://localhost:3000/api/auth/callback/github`
2. Add `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` to `.envrc`
3. Configure `socialProviders.github` in `src/lib/auth.ts` with `mapProfileToUser` and `accountLinking`
4. Export `linkSocial` from `src/lib/auth-client.ts`
5. Add "Sign in with GitHub" to login and create-account pages
6. Update `ConnectedProviders` component to detect linked GitHub and show "Connect" button

## Notes

- Auth server config: `src/lib/auth.ts`
- Auth client: `src/lib/auth-client.ts`
- GitHub icon already imported in `src/lib/icons.ts`
- Edge cases: GitHub account already linked to another user, username collision on first sign-up

## Agent Instructions

**What to look for:**
Better Auth server config, auth client exports, login page, and settings `ConnectedProviders` component.

**Files to check:**
- `src/lib/auth.ts` — add `socialProviders.github`, `account.accountLinking`
- `src/lib/auth-client.ts` — export `linkSocial`
- `src/lib/auth.test.ts` — add test credentials for GitHub provider
- `src/app/login/page.tsx` — add "Sign in with GitHub" button
- `src/app/login/create-account/page.tsx` — add "Sign up with GitHub" button
- `src/app/settings/_components/connected-providers.tsx` — add "Connect GitHub" button
- `.envrc` — add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

**What not to change:**
- Existing email/password auth flow
- Route handler (`src/app/api/auth/[...all]/route.ts`)

**Verification:**
1. Set up GitHub OAuth App and add credentials to `.envrc`
2. `yarn dev` → visit `/login` → click "Sign in with GitHub"
3. Sign in with email → go `/settings` → click "Connect GitHub"
4. Run `yarn lint` and `yarn test:run`

## Tasks

- [ ] Create GitHub OAuth App and get credentials
- [ ] Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.envrc`
- [ ] Update `src/lib/auth.ts` with GitHub provider config
- [ ] Update `src/lib/auth.test.ts` with test credentials
- [ ] Export `linkSocial` from `src/lib/auth-client.ts`
- [ ] Add "Sign in with GitHub" to login and create-account pages
- [ ] Update `ConnectedProviders` with GitHub linking
- [ ] Run `yarn lint` and `yarn test:run`
- [ ] Manual testing of login and account linking flows

---

*Migrated from plan [02-github-oauth-login](../plans/02-github-oauth-login.md).*
