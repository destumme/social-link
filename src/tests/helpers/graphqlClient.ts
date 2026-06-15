import { createClient, fetchExchange } from "@urql/core";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT ??
  `http://localhost:${process.env.PORT ?? 3000}/api/graphql`;

export function createTestGraphQLClient(headers: Headers) {
  const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let body: string;
    if (typeof input === "string" && input.includes("query=")) {
      const url = new URL(input);
      const query = url.searchParams.get("query") ?? "";
      const variablesRaw = url.searchParams.get("variables") ?? "{}";
      body = JSON.stringify({
        query,
        variables: JSON.parse(variablesRaw),
      });
    } else if (typeof init?.body === "string") {
      body = init.body;
    } else {
      body = JSON.stringify(init?.body ?? {});
    }

    const requestHeaders = new Headers(headers);
    requestHeaders.set("Content-Type", "application/json");

    const request = new Request(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: requestHeaders,
      body,
    });

    return fetch(request);
  };

  return createClient({
    url: GRAPHQL_ENDPOINT,
    exchanges: [fetchExchange],
    fetch: customFetch,
  });
}
