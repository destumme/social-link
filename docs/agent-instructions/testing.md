# Testing

- **Framework**: Vitest (`vitest.config.ts`) — uses `test.projects` to define two projects: `unit` and `integration`.
  - Unit tests: `fileParallelism: true` (mocked Prisma, no DB needed)
  - Integration tests: `fileParallelism: false` (real DB, avoid interference)
- **Setup**: `src/tests/setup.ts` extends `@testing-library/jest-dom` matchers

| Task | Command |
|---|---|
| Watch (unit) | `yarn test` |
| Run once (unit) | `yarn test:run` |
| Coverage (unit) | `yarn test:coverage` |
| Run once (integration) | `make int-test` |

- **NEVER run integration tests outside of `make int-test`**. The Makefile sets `DATABASE_URL` to the dedicated test database (`social_links_test`). Running integration tests directly (e.g. `yarn test:run`, `vitest run --project integration`) will use `.envrc`'s `DATABASE_URL` and mutate the **main** database.

- **Unit tests** in `src/tests/unit/lib/services/` — one per service file. Use `createMockPrisma()` from `src/tests/helpers/mockPrisma.ts` to mock Prisma models. Mock objects must include all required Prisma fields (`id`, `createdAt`, `updatedAt`, etc.).
- **Integration tests** in `src/tests/integration/` — test real Prisma connections and GraphQL operations.
  - `prisma-connection.test.ts` — basic Prisma CRUD
  - `graphql/` — GraphQL query/mutation tests using `createTestGraphQLClient()` from `src/tests/helpers/graphqlClient.ts`. This helper calls Yoga's handler directly (no HTTP server). Each test creates its own account via Prisma in `beforeEach`, passes the account ID to the client, and cleans the DB between tests.
  - Use `result.errors` (array) for GraphQL errors, `result.data` for successful responses.
  - `TEST_AUTHED_ACCOUNT_ID` env var overrides the hardcoded account ID in `context.ts` for tests.
- Mock Prisma supports `$transaction` with both array and callback patterns.
- Yoga test instance has `maskedErrors: false` so actual error messages are visible.
