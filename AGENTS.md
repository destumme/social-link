<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Guidelines

- Prefer simple over complex.
- Keep changes small and incremental.
- Only make changes that are confirmed.
- Use the `todowrite` tool to create todo checklists for any plan with 3+ steps before starting implementation.

# Project

Social links app — Next.js 16.2.6 + GraphQL Yoga + Prisma 7 + Better Auth + PostgreSQL.

## Commands

| Task | Command |
|---|---|
| Dev server | `yarn dev` |
| Production build | `yarn build` |
| Lint | `yarn lint` (eslint, no separate typecheck script — build runs TS) |
| Prisma generate | `yarn run prisma generate` |
| DB push (dev) | `yarn run prisma db push` |
| Seed DB | `yarn run prisma db seed` |

Package manager is **yarn 4.14.1** (`packageManager` field). Use `yarn`, not `npm install`.
Use `yarn run prisma` for Prisma CLI commands (not `npx`). If a `yarn run` command fails, do not retry — report the error instead.

## Architecture

- **GraphQL** at `/api/graphql` — single Yoga endpoint (`src/app/api/graphql/route.ts`). Uses `typeDefs` (code-first SDL in `src/lib/graphql/typeDefs.ts`) + resolvers in `src/lib/graphql/resolvers/`.
- **Resolvers** are split by domain: `account.ts`, `trait.ts`, `connection.ts`, `connectionGroup.ts`. All merged in `resolvers/index.ts`. Resolvers call the service layer, never Prisma directly.
- **Service layer** in `src/lib/services/` — four domain services (`accountService`, `traitService`, `connectionService`, `connectionGroupService`). Each exports namespaced sub-objects: `account.*` / `trait.*` / `connection.*` / `connectionGroup.*` for CRUD, `search.*` for queries, and `connectionPair.*` for pair operations. Services call Prisma directly.
- **Prisma client** is generated to `src/generated/prisma/` (custom output path). Adapter is `@prisma/adapter-pg` for PostgreSQL. Client imported from `@/generated/prisma/client`.
- **Auth** uses Better Auth (not yet wired into context — hardcoded account ID in `context.ts`).
- **Env** loaded via `direnv` (`.envrc`). Prisma reads `DATABASE_URL` from environment.

## UI & Theming

- **UI stack**: Base UI (`@base-ui/react`) headless primitives + Tailwind v4 + shadcn component registry + CVA (`class-variance-authority`) for component variants.
- **Component patterns**: `cn()` utility (`src/lib/utils.ts`) combines clsx + tailwind-merge. Components use `data-slot` attributes for targeting. `render` prop enables Next.js Link composition in dropdown items.
- **UI primitives** in `src/components/ui/` — explore for current components (button, dialog, select, dropdown, input, etc.).
- **Layout components** in `src/components/layout/` — explore for header, footer, main shell, theme selector.
- **Icons**: `@hugeicons/react` with category mappings in `src/lib/icons.ts`.

### Dynamic Theming

- **Architecture**: CSS custom properties scoped to `[data-theme="..."]` on `<html>`. Each theme defines semantic tokens: `--background`, `--foreground`, `--primary`, `--card`, `--sidebar-*`, `--chart-*`, `--notebook-*`, etc.
- **Color format**: OKLCH exclusively.
- **Tailwind mapping**: `@theme inline` block in `src/app/globals.css` maps CSS vars to utility classes (`bg-background`, `text-primary`, `rounded-lg`).
- **ThemeProvider** (`src/components/theme-provider.tsx`): React context using `useSyncExternalStore`, persists theme to localStorage, sets default theme.
- **ThemeScript** (`src/components/theme-script.tsx`): inline `<script>` injected in `<body>` for FOUC prevention — runs before hydration.
- **Theme selector** (`src/components/layout/theme-selector.tsx`): dropdown UI with color swatch previews.
- **Dark mode**: `@custom-variant dark` in `globals.css` classifies which themes trigger `dark:` Tailwind variants.
- **Notebook effect**: decorative vertical/horizontal lines via `--notebook-vertical-line` / `--notebook-horizontal-line` CSS vars, colors vary per theme.
- Explore `src/app/globals.css` for all available themes and their color tokens.

## Testing

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

- **Unit tests** in `src/tests/unit/lib/services/` — one per service file. Use `createMockPrisma()` from `src/tests/helpers/mockPrisma.ts` to mock Prisma models. Mock objects must include all required Prisma fields (`id`, `createdAt`, `updatedAt`, etc.).
- **Integration tests** in `src/tests/integration/` — test real Prisma connections and GraphQL operations.
  - `prisma-connection.test.ts` — basic Prisma CRUD
  - `graphql/` — GraphQL query/mutation tests using `createTestGraphQLClient()` from `src/tests/helpers/graphqlClient.ts`. This helper calls Yoga's handler directly (no HTTP server). Each test creates its own account via Prisma in `beforeEach`, passes the account ID to the client, and cleans the DB between tests.
  - Use `result.errors` (array) for GraphQL errors, `result.data` for successful responses.
  - `TEST_AUTHED_ACCOUNT_ID` env var overrides the hardcoded account ID in `context.ts` for tests.
- Mock Prisma supports `$transaction` with both array and callback patterns.
- Yoga test instance has `maskedErrors: false` so actual error messages are visible.

## Skills

Always check if an available skill applies before starting work. Load the relevant skill via the `skill` tool when its trigger conditions are met.

| Skill | When to use |
|---|---|
| `better-auth-best-practices` | Configuring Better Auth server/client, database adapters, sessions, plugins, env vars |
| `create-auth-skill` | Scaffolding auth with Better Auth — login, sign-up, OAuth, auth UI pages |
| `customize-opencode` | Editing opencode config (`opencode.json`, `.opencode/`, agents, skills, MCP servers) |
| `graphql-schema` | Designing or reviewing GraphQL schemas, types, nullability, pagination, errors, security |
| `next-best-practices` | Next.js patterns — file conventions, RSC boundaries, data patterns, metadata, route handlers |
| `prisma-client-api` | Writing Prisma queries — CRUD, filters, operators, `$transaction`, client configuration |
| `shadcn` | Working with shadcn/ui components, component registry, styling, presets |

## Project Structure

```
src/
├── app/              # Presentation layer — Next.js App Router pages, layouts, and API routes
│   ├── api/          # Backend API routes (GraphQL Yoga endpoint, health check)
│   ├── traits/       # Trait management UI
│   ├── groups/       # Connection groups management UI
│   ├── link/         # Public link page
│   ├── login/        # Authentication UI
│   └── settings/     # Account settings UI
├── components/       # Reusable UI layer — layout shells, shared icon components, and shadcn/ui primitives
│   ├── ui/           # shadcn-style primitive components (Base UI + Tailwind)
│   ├── layout/       # App shell components (header, footer, main, theme selector)
│   ├── theme-provider.tsx   # Theme context + localStorage persistence
│   └── theme-script.tsx     # SSR-safe theme injection (FOUC prevention)
├── generated/        # Auto-generated code — Prisma client output
├── lib/              # Business logic layer — services, GraphQL schema/resolvers, utilities
│   ├── database/     # Database connection and low-level utilities
│   ├── graphql/      # GraphQL layer — SDL type definitions, domain resolvers, error types, context
│   ├── services/     # Service layer — namespaced CRUD and search operations per domain
│   └── utils/        # Shared helpers (logging, general utilities)
└── tests/            # Test suite — unit tests for services, integration tests for Prisma and GraphQL
    ├── helpers/      # Test fixtures and utilities (mock Prisma, GraphQL client, test DB)
    ├── integration/  # End-to-end tests against real Prisma and GraphQL handler
    └── unit/         # Isolated service-layer tests with mocked Prisma
```

## Key Constraints

- Do **not** implement resolvers that currently throw `"Not implemented"` unless explicitly asked.
- GraphQL errors use `GraphqlAppError` subclasses from `src/lib/graphql/errors.ts`
- Prisma many-to-many relations use `connect` / `disconnect`
- The `accountByUsername` query currently does a partial case-insensitive search (not exact match), despite the service comment saying otherwise.
