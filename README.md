# Social Links

Social links app — Next.js 16 + GraphQL Yoga + Prisma 7 + Better Auth + PostgreSQL.

## Dev Commands

| Task | Command |
|---|---|
| Dev server | `yarn dev` |
| Production build | `yarn build` |
| Lint | `yarn lint` |
| Lint fix | `yarn lint:fix` |
| Prisma generate | `yarn run prisma generate` |
| DB push (dev) | `yarn run prisma db push` |
| Seed DB | `yarn run prisma db seed` |
| Test (unit, watch) | `yarn test` |
| Test (unit, once) | `yarn test:run` |
| Test (integration) | `make int-test` |
| Docker up | `yarn docker:up` |
| Docker down | `yarn docker:down` |

Package manager: **yarn 4**

## Stack

- **Frontend**: Next.js 16 (App Router), Base UI, Tailwind v4, shadcn/ui
- **API**: GraphQL Yoga at `/api/graphql`
- **Database**: PostgreSQL via Prisma 7 (`@prisma/adapter-pg`)
- **Auth**: Better Auth

## Setup

```bash
yarn install
yarn run prisma generate
yarn dev
```

Requires PostgreSQL. Config via `.envrc` (direnv).

## Docs

- [Architecture](docs/architecture.md)
- [Data Models](docs/data-models.md)
- [GraphQL](docs/graphql.md)
- [Page Structure](docs/page-structure.md)
- [Project Summary](docs/summary.md)
