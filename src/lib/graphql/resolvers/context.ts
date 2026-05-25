export interface GraphQLContext {
  authedAccountId: string;
}

export function createContext(request: Request): GraphQLContext {
  const accountId =
    process.env.TEST_AUTHED_ACCOUNT_ID ??
    "313847cb-6102-4455-9af9-86a769ccc2da";

  return {
    authedAccountId: accountId,
  };
}
