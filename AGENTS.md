<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Guidelines

- Prefer simple over complex.
- Keep changes small and incremental.
- Only make changes that are confirmed.

# Project

Social links app — Next.js 16.2.6 + GraphQL Yoga + Prisma 7 + Better Auth + PostgreSQL.

## Commands

| Task | Command |
|---|---|
| Dev server | `yarn dev` |
| Production build | `yarn build` |
| Lint | `yarn lint` (eslint, no separate typecheck script — build runs TS) |
| Prisma generate | `npx prisma generate` |
| DB push (dev) | `npx prisma db push` |
| Seed DB | `npx tsx prisma/seed.ts` |

Package manager is **yarn 4.14.1** (`packageManager` field). Use `yarn`, not `npm install`.

## Architecture

- **GraphQL** at `/api/graphql` — single Yoga endpoint (`src/app/api/graphql/route.ts`). Uses `typeDefs` (code-first SDL in `src/lib/graphql/typeDefs.ts`) + resolvers in `src/lib/graphql/resolvers/`.
- **Resolvers** are split by domain: `account.ts`, `trait.ts`, `connection.ts`, `connectionGroup.ts`. All merged in `resolvers/index.ts`. Resolvers call the service layer, never Prisma directly.
- **Service layer** in `src/lib/services/` — four domain services (`accountService`, `traitService`, `connectionService`, `connectionGroupService`). Each exports namespaced sub-objects: `account.*` / `trait.*` / `connection.*` / `connectionGroup.*` for CRUD, `search.*` for queries, and `connectionPair.*` for pair operations. Services call Prisma directly.
- **Prisma client** is generated to `src/generated/prisma/` (custom output path). Adapter is `@prisma/adapter-pg` for PostgreSQL. Client imported from `@/generated/prisma/client`.
- **Auth** uses Better Auth (not yet wired into context — hardcoded account ID in `context.ts`).
- **Env** loaded via `direnv` (`.envrc`). Prisma reads `DATABASE_URL` from environment.

## Testing

- **Framework**: Vitest (`vitest.config.ts`) — `fileParallelism: false` to avoid DB interference
- **Setup**: `src/tests/setup.ts` extends `@testing-library/jest-dom` matchers

| Task | Command |
|---|---|
| Watch mode | `yarn test` |
| Run once | `yarn test:run` |
| Coverage | `yarn test:coverage` |

- **Unit tests** in `src/tests/unit/lib/services/` — one per service file. Use `createMockPrisma()` from `src/tests/helpers/mockPrisma.ts` to mock Prisma models. Mock objects must include all required Prisma fields (`id`, `createdAt`, `updatedAt`, etc.).
- **Integration tests** in `src/tests/integration/` — test real Prisma connections and GraphQL operations.
  - `prisma-connection.test.ts` — basic Prisma CRUD
  - `graphql/` — GraphQL query/mutation tests using `createTestGraphQLClient()` from `src/tests/helpers/graphqlClient.ts`. This helper calls Yoga's handler directly (no HTTP server). Each test creates its own account via Prisma in `beforeEach`, passes the account ID to the client, and cleans the DB between tests.
  - Use `result.errors` (array) for GraphQL errors, `result.data` for successful responses.
  - `TEST_AUTHED_ACCOUNT_ID` env var overrides the hardcoded account ID in `context.ts` for tests.
- Mock Prisma supports `$transaction` with both array and callback patterns.
- Yoga test instance has `maskedErrors: false` so actual error messages are visible.

## Key Constraints

- Do **not** implement resolvers that currently throw `"Not implemented"` unless explicitly asked.
- GraphQL errors use `GraphqlAppError` subclasses from `src/lib/graphql/errors.ts`
- Prisma many-to-many relations use `connect` / `disconnect`
- The `accountByUsername` query currently does a partial case-insensitive search (not exact match), despite the service comment saying otherwise.
