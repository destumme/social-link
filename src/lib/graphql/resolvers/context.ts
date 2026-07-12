import { auth } from "@/lib/auth";

/** GraphQL request context carrying the authenticated user's ID (if any). */
export interface GraphQLContext {
  authedUserId: string | null;
}

/**
 * Creates the GraphQL context for each incoming request by extracting the
 * authenticated user from the session.
 *
 * @param request - The incoming HTTP request containing auth headers.
 * @returns A GraphQLContext with the authenticated user ID, or `null` if unauthenticated.
 */
export async function createContext(request: Request): Promise<GraphQLContext> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return {
    authedUserId: session?.user?.id ?? null,
  };
}
