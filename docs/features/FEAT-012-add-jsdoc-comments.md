# FEAT-012: Add JSDoc Comments to Resolvers & Services

---
page: multiple
area: code-quality
priority: low
status: proposed
created: 2026-07-12
---

## Summary

Add JSDoc comments to every function in the GraphQL resolver and service layer files. This improves code discoverability, helps agents understand intent, and serves as living documentation for the API surface.

## Motivation

The resolver and service layers have ~72 functions across 9 files with no JSDoc comments. Adding structured documentation with `@param`, `@returns`, and `@throws` tags improves maintainability and agent comprehension.

## Scope

**In scope:**

### Resolver files (5 files, ~34 functions)

| File | Functions | Notes |
|---|---|---|
| `src/lib/graphql/resolvers/user.ts` | 8 | Type resolvers (3), Query (4), Mutation (1) |
| `src/lib/graphql/resolvers/trait.ts` | 8 | Type resolvers (2), Query (3), Mutation (3) |
| `src/lib/graphql/resolvers/connection.ts` | 11 | Type resolvers (4), Query (3), Mutation (7) |
| `src/lib/graphql/resolvers/connectionGroup.ts` | 9 | Type resolvers (3), Query (1), Mutation (5) |
| `src/lib/graphql/resolvers/context.ts` | 1 | Context factory |

### Service files (4 files, ~42 functions)

| File | Functions | Notes |
|---|---|---|
| `src/lib/services/connectionService.ts` | 19 | CRUD, pair operations, search helpers |
| `src/lib/services/traitService.ts` | 7 | CRUD, search helpers |
| `src/lib/services/connectionGroupService.ts` | 10 | CRUD, trait management, search helpers |
| `src/lib/services/userService.ts` | 8 | User lookup, traits, connections, groups |

**Out of scope:**
- `errors.ts` (custom error classes, self-documenting)
- `resolvers/index.ts` (barrel assembly)
- `resolvers/scalars.ts` (re-export only)

## Design

Each function gets a JSDoc block with:

```ts
/**
 * Brief description of what the function does.
 *
 * @param paramName - Description of the parameter
 * @returns Description of the return value
 * @throws AuthenticationError - When the user is not authenticated
 * @throws AuthorizationError - When the user does not own this resource
 * @throws NotFoundError - When the requested entity does not exist
 */
```

### Conventions

1. **One-line summary** for simple pass-through functions (e.g., `findUserById`)
2. **Multi-line** for functions with auth checks, transactions, or business logic
3. **`@throws`** for every error the function can throw (auth, not-found, conflict, etc.)
4. **`@returns`** always included, even for `void` returns
5. **Resolver field resolvers** describe what GraphQL field they resolve and any visibility/auth rules
6. **Service functions** describe the business operation, auth requirements, and side effects

## Notes

- Service files first (core business logic, easier to document in isolation), then resolver files.
- Run `yarn build` after each file to verify no regressions.
- Run `yarn lint:fix` after all changes.

## Agent Instructions

**What to look for:**
All exported functions in the service and resolver files listed in scope.

**Files to check:**
- `src/lib/services/userService.ts`
- `src/lib/services/traitService.ts`
- `src/lib/services/connectionGroupService.ts`
- `src/lib/services/connectionService.ts`
- `src/lib/graphql/resolvers/context.ts`
- `src/lib/graphql/resolvers/user.ts`
- `src/lib/graphql/resolvers/trait.ts`
- `src/lib/graphql/resolvers/connectionGroup.ts`
- `src/lib/graphql/resolvers/connection.ts`

**What not to change:**
- Do not change any function logic, only add JSDoc comments.
- Do not add comments to barrel files or error classes.

**Verification:**
1. `yarn build` passes
2. `yarn lint:fix` passes
3. Every function in scope has a JSDoc comment with at least a summary line

## Tasks

- [ ] Add JSDoc to `src/lib/services/userService.ts`
- [ ] Add JSDoc to `src/lib/services/traitService.ts`
- [ ] Add JSDoc to `src/lib/services/connectionGroupService.ts`
- [ ] Add JSDoc to `src/lib/services/connectionService.ts`
- [ ] Add JSDoc to `src/lib/graphql/resolvers/context.ts`
- [ ] Add JSDoc to `src/lib/graphql/resolvers/user.ts`
- [ ] Add JSDoc to `src/lib/graphql/resolvers/trait.ts`
- [ ] Add JSDoc to `src/lib/graphql/resolvers/connectionGroup.ts`
- [ ] Add JSDoc to `src/lib/graphql/resolvers/connection.ts`
- [ ] Run `yarn build` and `yarn lint:fix`
