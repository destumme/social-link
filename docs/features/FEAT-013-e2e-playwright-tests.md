# FEAT-013: E2E Playwright Tests

---
page: multiple
area: testing
priority: medium
status: proposed
created: 2026-07-12
---

## Summary

Add end-to-end testing with Playwright to cover critical user flows that cannot be validated by unit or integration tests alone. This includes authentication flows, page rendering with real browser interactions, and full-stack user journeys.

## Motivation

The project currently has unit tests (Vitest + mocked Prisma) and integration tests (Vitest + real database), but no browser-level E2E tests. Critical flows like login, page navigation, and form submissions are untested in a real browser context.

## Scope

**In scope:**
- Install Playwright and configure for Next.js
- Set up dedicated test database and server lifecycle
- Create auth helper for E2E tests
- Write initial smoke tests for critical user flows (auth, landing, link page, settings)
- Add `yarn test:e2e` command and `make e2e-test` target
- Document E2E testing conventions

**Out of scope:**
- Modifying existing unit or integration tests
- CI pipeline integration (future follow-up)
- Firefox/Safari browser testing (Chromium only initially)

## Design

### Infrastructure

- **Config:** `playwright.config.ts` at project root, `testDir: src/tests/e2e/`, `webServer` runs `yarn dev` on port 3003
- **Database:** Dedicated `social_links_e2e` database via `e2e.docker-compose.yaml`
- **Auth:** Browser-based login (fill form + submit) to validate full auth flow; `authPage` fixture for pre-authenticated state
- **Scripts:** `yarn test:e2e`, `yarn test:e2e:ui`, `yarn test:e2e:headed`

### Initial Test Suite

| Test File | Flows |
|---|---|
| `auth.spec.ts` | Login, sign-up, invalid credentials, logout |
| `landing.spec.ts` | Unauthenticated landing page, authenticated redirect |
| `link-page.spec.ts` | Own link page, public profile, 404 for non-existent user |
| `settings.spec.ts` | Authenticated settings, unauthenticated redirect |

### File Structure

```
playwright.config.ts
e2e.docker-compose.yaml
src/tests/e2e/
├── fixtures.ts
├── helpers/
│   ├── auth.ts
│   └── db.ts
├── auth.spec.ts
├── landing.spec.ts
├── link-page.spec.ts
└── settings.spec.ts
```

## Notes

- Use `fullyParallel: true` and Playwright's auto-wait to avoid flaky tests.
- Clean database in `beforeEach` with unique test data (timestamps in emails).
- Only install Chromium initially to limit disk usage.

## Agent Instructions

**What to look for:**
No existing Playwright setup exists. This is a greenfield addition.

**Files to check:**
- `package.json` — add devDependency and scripts
- `Makefile` — add `e2e-test` target
- `docker-compose.yaml` — reference for `e2e.docker-compose.yaml` pattern
- `src/tests/helpers/` — reference for auth and DB helper patterns

**What not to change:**
- Existing unit or integration tests
- `docker-compose.yaml` (dev database)
- `int.docker-compose.yaml` (integration test database)
- Production environment variables or `.envrc`

**Verification:**
1. `make e2e-test` runs all E2E tests successfully
2. `yarn test:e2e:ui` opens Playwright UI
3. `yarn build` still passes
4. Existing `yarn test` and `make int-test` are unaffected

## Tasks

- [ ] Install `@playwright/test` and Chromium
- [ ] Create `playwright.config.ts`
- [ ] Add `test:e2e` scripts to `package.json`
- [ ] Create `e2e.docker-compose.yaml`
- [ ] Add `make e2e-test` target to `Makefile`
- [ ] Create `src/tests/e2e/helpers/auth.ts`
- [ ] Create `src/tests/e2e/helpers/db.ts`
- [ ] Create `src/tests/e2e/fixtures.ts`
- [ ] Write `auth.spec.ts`
- [ ] Write `landing.spec.ts`
- [ ] Write `link-page.spec.ts`
- [ ] Write `settings.spec.ts`
- [ ] Document E2E conventions in `docs/agent-instructions/testing.md`
