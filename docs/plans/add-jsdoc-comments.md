# Add JSDoc Comments to Resolvers & Services

**Status:** Planned  
**Started:** (to be created)  
**Branch:** (to be created)

## Overview

Add JSDoc comments to every function in the GraphQL resolver and service layer files. This improves code discoverability, helps agents understand intent, and serves as living documentation for the API surface.

## Scope

### Resolver files (5 files, ~34 functions)

| File | Functions | Notes |
|---|---|---|
| `src/lib/graphql/resolvers/user.ts` | 8 | Type resolvers (3), Query (4), Mutation (1) |
| `src/lib/graphql/resolvers/trait.ts` | 8 | Type resolvers (2), Query (3), Mutation (3) |
| `src/lib/graphql/resolvers/connection.ts` | 11 | Type resolvers (4), Query (3), Mutation (7) |
| `src/lib/graphql/resolvers/connectionGroup.ts` | 9 | Type resolvers (3), Query (1), Mutation (5) |
| `src/lib/graphql/resolvers/context.ts` | 1 | Context factory |

Excluded: `index.ts` (barrel assembly), `scalars.ts` (re-export only).

### Service files (4 files, ~42 functions)

| File | Functions | Notes |
|---|---|---|
| `src/lib/services/connectionService.ts` | 19 | CRUD, pair operations, search helpers |
| `src/lib/services/traitService.ts` | 7 | CRUD, search helpers |
| `src/lib/services/connectionGroupService.ts` | 10 | CRUD, trait management, search helpers |
| `src/lib/services/userService.ts` | 8 | User lookup, traits, connections, groups |

Excluded: `errors.ts` (custom error classes, self-documenting).

**Total: ~72 functions across 9 files.**

## Comment Format

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

### Examples

**Service function:**
```ts
/**
 * Finds all accepted connections for the authenticated user.
 *
 * @param status - The connection status to filter by (e.g., "ACCEPTED")
 * @returns Array of connections where the user is initiator or recipient
 * @throws AuthenticationError - When the user is not authenticated
 */
async function findConnectionsByAccountId(status: ConnectionStatus) { ... }
```

**Resolver field:**
```ts
/**
 * Resolves the `traits` field on the `User` type.
 * Returns all traits if viewing own profile, or only visible-group-shared
 * traits when viewing another user's profile.
 *
 * @param parent - The User object being resolved
 * @returns Array of Trait objects visible to the current viewer
 * @throws AuthenticationError - When the user is not authenticated
 */
traits: async (parent) => { ... }
```

**Simple pass-through:**
```ts
/**
 * Looks up a user by their database ID.
 *
 * @param id - The user's database ID
 * @returns The User model, or null if not found
 */
function findUserById(id: string) { ... }
```

## Execution Plan

1. **Service files first** — they have the core business logic and are easier to document in isolation
2. **Resolver files second** — can reference service function docs for consistency
3. **Run `yarn build`** after each file to verify no regressions
4. **Run `yarn lint:fix`** after all changes

### Order

1. `src/lib/services/userService.ts` (8 functions)
2. `src/lib/services/traitService.ts` (7 functions)
3. `src/lib/services/connectionGroupService.ts` (10 functions)
4. `src/lib/services/connectionService.ts` (19 functions)
5. `src/lib/graphql/resolvers/context.ts` (1 function)
6. `src/lib/graphql/resolvers/user.ts` (8 functions)
7. `src/lib/graphql/resolvers/trait.ts` (8 functions)
8. `src/lib/graphql/resolvers/connectionGroup.ts` (9 functions)
9. `src/lib/graphql/resolvers/connection.ts` (11 functions)
