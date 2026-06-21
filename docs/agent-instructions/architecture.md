# Architecture

- **GraphQL** at `/api/graphql` — single Yoga endpoint (`src/app/api/graphql/route.ts`). Uses `typeDefs` (code-first SDL in `src/lib/graphql/typeDefs.ts`) + resolvers in `src/lib/graphql/resolvers/`.
- **Resolvers** are split by domain: `account.ts`, `trait.ts`, `connection.ts`, `connectionGroup.ts`. All merged in `resolvers/index.ts`. Resolvers call the service layer, never Prisma directly.
- **Service layer** in `src/lib/services/` — four domain services (`accountService`, `traitService`, `connectionService`, `connectionGroupService`). Each exports namespaced sub-objects: `account.*` / `trait.*` / `connection.*` / `connectionGroup.*` for CRUD, `search.*` for queries, and `connectionPair.*` for pair operations. Services call Prisma directly.
- **Prisma client** is generated to `src/generated/prisma/` (custom output path). Adapter is `@prisma/adapter-pg` for PostgreSQL. Client imported from `@/generated/prisma/client`.
- **Auth** uses Better Auth (not yet wired into context — hardcoded account ID in `context.ts`).
- **Env** loaded via `direnv` (`.envrc`). Prisma reads `DATABASE_URL` from environment.
