# BUG-004: Integration tests share host with running dev service

---
page: N/A (infra)
area: testing / CI
severity: medium
status: open
created: 2026-06-21
---

## Observed Behavior

`make int-test` starts the Next.js dev server via `yarn dev -p 3002 &` on the host, and integration tests run against it. This means:

- The integration test server can conflict with a currently running `yarn dev` (port collision if the default 3000 is occupied, or DB contention if both point at the same database).
- The Makefile only puts PostgreSQL in Docker (`docker-compose.yaml`); the application runs as a host process.
- If the host has a dev server already running pointing at the same database, tests read/write the same data.

## Expected Behavior

`make int-test` should be fully containerized: the Next.js app should run inside Docker alongside PostgreSQL, with no host processes. Running `make int-test` should not interact with or be affected by any running `yarn dev`.

## Notes

Current flow in `Makefile:int-test`:

```
docker compose up -d          # starts postgres container only
sleep 10                       # wait for DB
yarn prisma db push            # push schema to test DB
yarn dev -p 3002 &             # start dev server on host :3002
sleep 5                        # wait for dev server
yarn run vitest run --project integration
```

Current `docker-compose.yaml` only defines `postgres` — no app service.

Integration test GraphQL client (`src/tests/helpers/graphqlClient.ts:3-5`) connects to `http://localhost:${PORT}/api/graphql` where `PORT` defaults to 3000.

## Fix

Create `docker-compose.int-test.yaml` that uses `extends` (per-service) to pull `postgres` from the base compose, and adds an `app` service for the Next.js production server.

Example structure:

```yaml
services:
  postgres:
    extends:
      file: docker-compose.yaml
      service: postgres

  app:
    build: .
    ports:
      - "${PORT:-3002}:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL:-http://localhost:${PORT:-3002}}
    depends_on:
      postgres:
        condition: service_healthy
```

The Makefile exports (`int-test: export`) set these vars on the host.
Note: `DATABASE_URL` inside the container must use the service name `postgres` as host (e.g. `postgresql://test:test@postgres:5432/social_links_test`), not `localhost`. The Makefile will need a separate export or the compose file should transform it. One option: export `DB_HOST=postgres` and use `DATABASE_URL=postgresql://${PG_USER:-test}:${PG_PW:-test}@${DB_HOST}:5432/${PG_DB:-social_links_test}?schema=public` in the compose file environment.

Then update `make int-test` to:

1. `docker compose -f docker-compose.int-test.yaml up -d --build` to start both postgres and app
2. Remove `yarn dev -p 3002 &` — app runs in Docker instead

## Agent Instructions

**What to look for:**
The Makefile `int-test` target that starts `yarn dev` as a host process, and the docker-compose that only runs PostgreSQL.

**Files to check:**
- `Makefile` — replace `yarn dev -p 3002 &` with int-test compose up
- `docker-compose.int-test.yaml` — new file, uses `extends` per-service to pull `postgres` from base, adds `app` service
- `Dockerfile` — create if one doesn't exist (multi-stage, production build)

**What not to change:**
- `docker-compose.yaml` — base compose stays as-is (postgres only for dev)
- Integration test files
- GraphQL client
- Vitest config
- Prisma schema

**Verification:**
1. Kill any running `yarn dev`
2. Run `make int-test`
3. Confirm tests pass without starting a host dev server
4. Confirm running `yarn dev` separately on port 3000 does not affect test results

## Tasks

- [ ] Create `Dockerfile` for Next.js production build
- [ ] Create `docker-compose.int-test.yaml` using `extends` to pull `postgres` from base compose, adding `app` service
- [ ] Update `make int-test` to use `docker compose -f docker-compose.int-test.yaml` and remove `yarn dev` host process
- [ ] Run `make int-test` and verify tests pass fully containerized
