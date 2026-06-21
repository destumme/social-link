# Key Constraints

- Do **not** implement resolvers that currently throw `"Not implemented"` unless explicitly asked.
- GraphQL errors use `GraphqlAppError` subclasses from `src/lib/graphql/errors.ts`
- Prisma many-to-many relations use `connect` / `disconnect`
- The `accountByUsername` query currently does a partial case-insensitive search (not exact match), despite the service comment saying otherwise.
