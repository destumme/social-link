import { auth } from "@/lib/auth";

export interface GraphQLContext {
  authedUserId: string | null;
}

export async function createContext(request: Request): Promise<GraphQLContext> {
  if (process.env.TEST_AUTHED_USER_ID) {
    return {
      authedUserId: process.env.TEST_AUTHED_USER_ID,
    };
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return {
    authedUserId: session?.user?.id ?? null,
  };
}
