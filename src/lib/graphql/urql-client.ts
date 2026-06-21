import { createClient, cacheExchange, fetchExchange } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";

const makeClient = () =>
  createClient({
    url: "/api/graphql",
    fetchOptions: { cache: "no-store" },
    exchanges: [cacheExchange, fetchExchange],
  });

export const { getClient } = registerUrql(makeClient);
