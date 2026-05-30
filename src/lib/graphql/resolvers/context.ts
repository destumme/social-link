import { auth } from "@/lib/auth";

export interface GraphQLContext {
  authedAccountId: string | null;
}

export async function createContext(request: Request): Promise<GraphQLContext> {
  if (process.env.TEST_AUTHED_ACCOUNT_ID) {
    return {
      authedAccountId: process.env.TEST_AUTHED_ACCOUNT_ID,
    };
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return {
    authedAccountId: session?.user?.id ?? null,
  };
}
