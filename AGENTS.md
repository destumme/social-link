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
- **Resolvers** are split by domain: `account.ts`, `trait.ts`, `connection.ts`, `connectionGroup.ts`. All merged in `resolvers/index.ts`.
- **No service layer** — resolver functions call Prisma directly. `GraphqlContext` only carries `authedAccountId`.
- **Prisma client** is generated to `src/generated/prisma/client` (custom output path). Adapter is `@prisma/adapter-pg` for PostgreSQL.
- **Auth** uses Better Auth (not yet wired into context — hardcoded account ID in `context.ts`).
- **Env** loaded via `direnv` (`.envrc`). Prisma reads `DATABASE_URL` from environment.

## Key Constraints

- Do **not** implement resolvers that currently throw `"Not implemented"` unless explicitly asked.
- GraphQL errors use `GraphqlAppError` subclasses from `src/lib/graphql/errors.ts`
- Prisma many-to-many relations use `connect` / `disconnect`
- The `accountByUsername` query currently does a partial case-insensitive search (not exact match), despite the service comment saying otherwise.
