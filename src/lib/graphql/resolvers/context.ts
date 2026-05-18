import { services } from "@/lib/services";

export interface GraphqlContext {
  accountId?: string;
  services: typeof services;
}

export function createContext(request: Request): GraphqlContext {
  const accountId = "313847cb-6102-4455-9af9-86a769ccc2da";

  return {
    accountId,
    services,
  };
}
