<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Guidelines

- Prefer simple over complex.
- Keep changes small and incremental.
- Only make changes that are confirmed.
- Use the `todowrite` tool to create todo checklists for any plan with 3+ steps before starting implementation.

# Git Workflow

- Begin all feature and bug-fix work in a **git worktree** (not the main working directory).
- Create the worktree on a new branch named descriptively (e.g., `feature/add-oauth`, `fix/login-redirect`), put it in the ./worktree folder
- When the work is complete and ready to merge:
  1. **Always confirm with the user before squashing.**
  2. Show the user a `git diff` of all changes that will be included in the squash.
  3. Only squash and merge after the user explicitly approves.
- Clean up the worktree branch after it has been merged.

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
docs/
├── agent-instructions/   # Agent reference pages (architecture, data-fetching, testing, etc.)
├── bugs/                 # Bug tracker — template, index, and individual bug reports
├── features/             # Feature tracker — template, index, and feature specs
├── plans/                # Implementation plans for past and upcoming work
├── architecture.md       # High-level system architecture overview
├── data-models.md        # Database schema and model documentation
├── graphql.md            # GraphQL schema and API docs
├── page-structure.md     # Page layout and routing documentation
└── summary.md            # Project summary and overview
```

## Architecture

See [docs/agent-instructions/architecture.md](docs/agent-instructions/architecture.md)

## Data Fetching: Server vs Client

See [docs/agent-instructions/data-fetching.md](docs/agent-instructions/data-fetching.md)

## UI & Theming

See [docs/agent-instructions/ui-and-theming.md](docs/agent-instructions/ui-and-theming.md)

## Testing

See [docs/agent-instructions/testing.md](docs/agent-instructions/testing.md)

## Key Constraints

See [docs/agent-instructions/key-constraints.md](docs/agent-instructions/key-constraints.md)

## Documentation

When tasked with a bug or feature, check the relevant tracker — each entry includes agent-facing instructions.

- **[Bug tracker](docs/bugs/index.md)** — each bug file has an `## Agent Instructions` section with `What to look for`, `Files to check`, `What not to change`, and `Verification`. See index for [Creating a New Bug](docs/bugs/index.md).
- **[Feature tracker](docs/features/index.md)** — each feature spec has an `## Agent Instructions` section with the same directives. See index for [Creating a New Feature](docs/features/index.md).
