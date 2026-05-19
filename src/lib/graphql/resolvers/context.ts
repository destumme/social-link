export interface GraphqlContext {
  authedAccountId: string;
}

export function createContext(request: Request): GraphqlContext {
  const accountId = "313847cb-6102-4455-9af9-86a769ccc2da";

  return {
    authedAccountId: accountId,
  };
}
