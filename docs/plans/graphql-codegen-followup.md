# GraphQL Codegen Follow-up: Output Path & Import Fix

**Status:** Planned  
**Created:** 2026-07-03  
**Branch:** (to be created)  
**Triggered by:** Monitoring changes from concurrent agent on `feat/connection-groups-fix`

## Overview

The other agent restructured the GraphQL codegen setup but left several loose ends: incorrect output paths, broken import references, duplicate typeDefs, and no client-side type sharing. This plan tracks all follow-up items to complete the refactor.

## Checklist

### 1. AGENTS.md — Prettier Rule
- [ ] Add rule to AGENTS.md: always run `yarn prettier --write` (or `yarn lint:fix`) after any code changes

### 2. Fix Server Types Output Path
- [ ] Update `codegen.ts` `generates` output from `src/generated/graphql-types.ts` → `src/generated/graphql/server.ts`
- [ ] Delete old `src/generated/graphql-types.ts` after regeneration
- [ ] Run `yarn gen:gql` and verify `src/generated/graphql/server.ts` is created with correct content

### 3. Fix `types.generated.ts` Re-export
- [ ] Update `src/lib/graphql/types.generated.ts` — change `@/generated/gql-server/types.generated` → `@/generated/graphql/server`
- [ ] Verify this re-export is actually needed (resolvers currently import directly from `@/generated/graphql-types`, bypassing it)

### 4. Update All Server-Side Import Paths
- [ ] `src/lib/graphql/resolvers/user.ts` — `@/generated/graphql-types` → `@/generated/graphql/server`
- [ ] `src/lib/graphql/resolvers/connection.ts` — `@/generated/graphql-types` → `@/generated/graphql/server`
- [ ] `src/lib/graphql/resolvers/connectionGroup.ts` — `@/generated/graphql-types` → `@/generated/graphql/server`
- [ ] `src/lib/graphql/resolvers/trait.ts` — `@/generated/graphql-types` → `@/generated/graphql/server`
- [ ] `src/lib/graphql/resolvers/index.ts` — `@/generated/graphql-types` → `@/generated/graphql/server`

### 5. Client-Side Codegen — Share Server Types
- [ ] Add a second `generates` entry in `codegen.ts` for client-side urql types that references the server schema
- [ ] Configure `src/generated/gql/` output to use `@/generated/graphql/server` types via `scalars` and shared config
- [ ] Ensure `@/generated/gql` `graphql()` function in `connections-table.tsx` returns properly typed `TypedDocumentNode`
- [ ] Verify `src/generated/gql/graphql.ts` is not empty (currently only 3 lines — needs document types regenerated once client queries exist)

### 6. Clean Up Duplicate TypeDefs
- [ ] **Source of truth: `src/lib/graphql/schema.graphql`** (user confirmed)
- [ ] Update `src/lib/graphql/index.ts` to read from `schema.graphql` via `readFileSync` instead of duplicating inline `/* GraphQL */` typeDefs
- [ ] Delete the inline typeDefs block from `index.ts`
- [ ] Remove or compose per-domain SDL files (`base/`, `connection/`, `trait/`, `user/`, `connectionGroup/`) into the single schema.graphql

### 7. Verify Build & Tests
- [ ] Run `yarn gen:gql` — no errors
- [ ] Run `yarn build` — TypeScript compiles with no import path errors
- [ ] Run `yarn lint` — no new violations
- [ ] Run test suite — all tests pass

### 8. `.gitignore` Generated Files
- [ ] Confirm `src/generated/` is in `.gitignore`
- [ ] Verify `src/generated/graphql/` and `src/generated/gql/` are gitignored

### 9. Update Integration Tests
- [ ] Run `yarn test src/tests/integration/` after all codegen changes — verify all 4 GraphQL test files pass
- [ ] **`graphql/user.test.ts`** — verify `me`, `userByUsername`, `searchUsers`, `updateUser` queries/mutations still work with restructured resolvers
- [ ] **`graphql/trait.test.ts`** — verify `myTraits`, `traitById`, `createTrait`, `updateTrait`, `deleteTrait` still work
- [ ] **`graphql/connection.test.ts`** — verify `myConnections`, `pendingConnections`, `connectionByAccount`, `requestConnection`, `acceptConnection`, `declineConnection`, `removeConnection`, `addConnectionToGroup`, `removeConnectionFromGroup`, `updateConnectionTraits` still work
- [ ] **`graphql/connectionGroup.test.ts`** — verify `myConnectionGroups`, `createConnectionGroup`, `updateConnectionGroup`, `deleteConnectionGroup`, `addTraitToGroup`, `removeTraitFromGroup` still work
- [ ] Check if any tests need query/mutation updates due to schema changes (new fields, removed fields, type changes)
- [ ] Verify `testDb` helper connects to test database correctly with new resolver structure
- [ ] If tests hit the live `/api/graphql` endpoint, confirm the route handler in `route.ts` still serves requests correctly after schema restructuring

## Current State

### Broken Imports
The following files reference `@/generated/graphql-types` which will move:
- `src/lib/graphql/resolvers/user.ts`
- `src/lib/graphql/resolvers/connection.ts`
- `src/lib/graphql/resolvers/connectionGroup.ts`
- `src/lib/graphql/resolvers/trait.ts`
- `src/lib/graphql/resolvers/index.ts`

### Stale Re-export
`src/lib/graphql/types.generated.ts` references `@/generated/gql-server/types.generated` — a path that doesn't exist.

### Duplicate TypeDefs
- `src/lib/graphql/index.ts` has inline `/* GraphQL */` typeDefs (~140 lines)
- `src/lib/graphql/schema.graphql` has the same schema as a file (~130 lines)
- Per-domain SDL files also exist: `base/`, `connection/`, `connectionGroup/`, `trait/`, `user/`

### Client Codegen Incomplete
- `src/generated/gql/graphql.ts` is nearly empty (3 lines) — document types not generated
- `src/generated/gql/gql.ts` has `documents = {}` — no typed document nodes
- `connections-table.tsx` uses `graphql()` from `@/generated/gql` but gets `unknown` return type

## Config Reference

### Current `codegen.ts`
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

### Target `codegen.ts` (after fix)
```ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/lib/graphql/schema.graphql',
  generates: {
    'src/generated/graphql/server': {
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
    'src/generated/graphql/client': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        // Share types from server output
      },
    },
  },
};
export default config;
```

## Build/Test Results (Pre-Fix)
- `yarn build`: Has pre-existing urql type error in `connections-table.tsx`
- `yarn test`: 52/53 pass (1 pre-existing failure in `connectionService.test.ts`)
