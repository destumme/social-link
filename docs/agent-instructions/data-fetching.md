# Data Fetching: Server vs Client

Server components should call the service layer, **not** the GraphQL API. The GraphQL layer exists as a client-facing API — server-side code already has direct access to the business logic. Prompt when service layer functionality is missing if it needs to be added.

```ts
// ✅ Server component: direct service call
import traitService from "@/lib/services/traitService";
const traits = await traitService.search.findTraitsByAccountId(accountId);

// ✅ Server component: direct Prisma for simple queries
import { prisma } from "@/lib/database/prisma";
const traits = await prisma.trait.findMany({ where: { accountId } });

// ✅ Server action: direct service call
"use server";
await traitService.trait.createTrait(data);

// ❌ Server component: avoid calling GraphQL
import { executeGraphQL } from "@/lib/graphql/server-execute";
const traits = await executeGraphQL(`query { myTraits { ... } }`);
```

Client components should use `useQuery` / `useMutation` from `@urql/next`. Never call `fetch("/api/graphql")` directly.

```tsx
// ✅ Client component: urql hooks
import { useQuery, useMutation } from "@urql/next";
const [{ data }] = useQuery({ query: MY_CONNECTIONS_QUERY });
const [, mutate] = useMutation(REMOVE_CONNECTION_MUTATION);

// ❌ Client component: avoid raw fetch
const res = await fetch("/api/graphql", { ... });
```

**Exception:** Use `registerUrql` + `getClient()` from `@urql/next/rsc` in a server component only when the same data is also queried by client components via `useQuery` — this enables SSR caching so the client doesn't refetch on hydration. See `docs/plans/urql-client-adoption.md`.

| Scenario | Approach |
|---|---|
| Server component, simple read | Direct Prisma or service |
| Server component, complex read | Direct service (preferred) |
| Server action mutation | Direct service |
| Client component read | `useQuery` from `@urql/next` |
| Client component mutation | `useMutation` from `@urql/next` |
| Client component, one-off query | `useQuery` or raw fetch if truly one-shot |
| RSC query + client mutation on same data | `registerUrql` in RSC + `useQuery` in client |
