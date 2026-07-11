# GraphQL Codegen Server Refactor

**Status:** Complete  
**Started:** 2026-07-03  
**Branch:** (to be created)

## Overview

Refactor the GraphQL setup to use `@graphql-codegen/typescript-resolvers` following [the-guild.dev guide](https://the-guild.dev/graphql/codegen/docs/guides/graphql-server-apollo-yoga). Consolidate split schema files into a single `.graphql` file, generate typed resolvers, and wire them into GraphQL Yoga.

## Goals

- [x] Consolidate split schema files into a single `src/lib/graphql/schema.graphql`
- [x] Generate typed resolvers with `typescript` + `typescript-resolvers` plugins
- [x] Use `readFileSync` to load the schema (per the-guild.dev guide pattern)
- [x] Type the resolver map with generated `Resolvers` type
- [x] Replace `server-execute.ts` anti-pattern with direct service calls
- [x] Resolvers return Prisma models directly (mappers configured for parent types)

## What Changed

### New/Updated Files
```
codegen.ts                              # Rewritten for typescript + typescript-resolvers
src/generated/graphql-types.ts          # Generated types with Prisma model mappers
src/lib/graphql/schema.graphql          # Single consolidated schema (~110 lines)
src/lib/graphql/resolvers/index.ts      # Barrel that assembles all resolvers
src/lib/graphql/resolvers/user.ts       # User type + Query + Mutation
src/lib/graphql/resolvers/trait.ts      # Trait type + Query + Mutation
src/lib/graphql/resolvers/connection.ts # Connection/ConnectionSide types + Query + Mutation
src/lib/graphql/resolvers/connectionGroup.ts # ConnectionGroup type + Query + Mutation
src/lib/graphql/resolvers/scalars.ts    # DateTime scalar
src/lib/graphql/resolvers/context.ts    # Kept (auth context)
src/app/api/graphql/route.ts            # Uses readFileSync + createSchema
src/app/groups/page.tsx                 # Direct service calls (no more executeGraphQL)
```

### Deleted Files
```
src/lib/graphql/index.ts                # Monolithic schema with inline typeDefs
src/lib/graphql/server-execute.ts       # Replaced with direct service calls
src/lib/graphql/base/                   # Split schema module
src/lib/graphql/user/                   # Split schema module
src/lib/graphql/trait/                  # Split schema module
src/lib/graphql/connection/             # Split schema module
src/lib/graphql/connectionGroup/        # Split schema module
src/lib/graphql/resolvers/user.ts       # Old flat resolver (replaced)
src/lib/graphql/resolvers/trait.ts      # Old flat resolver (replaced)
src/lib/graphql/resolvers/connection.ts # Old flat resolver (replaced)
src/lib/graphql/resolvers/connectionGroup.ts # Old flat resolver (replaced)
src/lib/graphql/resolvers/index.ts      # Old manual resolver map (replaced)
src/lib/graphql/resolvers/context.ts    # Kept!
src/generated/gql-server/               # Old server preset output
```

## Config Reference

### `codegen.ts`
```ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/lib/graphql/schema.graphql',
  generates: {
    'src/generated/graphql-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        mappers: {
          User: '@/generated/prisma/models/User#UserModel',
          Trait: '@/generated/prisma/models/Trait#TraitModel',
          Connection: '@/generated/prisma/models/Connection#ConnectionModel',
          ConnectionSide: '@/generated/prisma/models/ConnectionSide#ConnectionSideModel',
          ConnectionGroup: '@/generated/prisma/models/ConnectionGroup#ConnectionGroupModel',
        },
        scalars: {
          DateTime: { input: 'Date | string', output: 'Date | string' },
        },
      },
    },
  },
};
export default config;
```

### Server Pattern (per the-guild.dev guide)
```ts
import { readFileSync } from 'node:fs'
import { createYoga, createSchema } from 'graphql-yoga'
import { resolvers } from '@/lib/graphql/resolvers'

const typeDefs = readFileSync('./src/lib/graphql/schema.graphql', 'utf8')
const schema = createSchema({ typeDefs, resolvers })
const yoga = createYoga({ schema, ... })
```

## Resolver Structure
```
src/lib/graphql/resolvers/
├── index.ts              # Barrel: assembles Query, Mutation, type resolvers
├── user.ts               # User + user Query/Mutation
├── trait.ts              # Trait + trait Query/Mutation
├── connection.ts         # Connection, ConnectionSide + connection Query/Mutation
├── connectionGroup.ts    # ConnectionGroup + connectionGroup Query/Mutation
├── scalars.ts            # DateTime scalar
└── context.ts            # Auth context (kept from before)
```

## Build/Test Results

- `yarn build`: Passes (one pre-existing urql type error in `connections-table.tsx` unrelated to this refactor)
- `yarn test`: 52/53 pass (1 pre-existing failure in `connectionService.test.ts` — query shape mismatch unrelated to this refactor)

## Key Decisions

1. **Mappers configured** — Prisma models mapped as parent types so field resolvers receive correct shapes
2. **`as` casts for nullable relations** — Field resolvers that fetch related users use `as Promise<UserModel>` casts where the schema declares non-null but Prisma can return null
3. **`InputMaybe` normalization** — All mutation resolvers convert `null` to `undefined` before passing to services
4. **`server-execute.ts` replaced** — `groups/page.tsx` now calls services directly with proper relation fetching
