import { createClient, fetchExchange } from "@urql/core";
import { yoga } from "@/app/api/graphql/route";

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

    const request = new Request("http://localhost/api/graphql", {
      method: "POST",
      headers: requestHeaders,
      body,
    });

    return yoga.fetch(request);
  };

  return createClient({
    url: "http://localhost/api/graphql",
    exchanges: [fetchExchange],
    fetch: customFetch,
  });
}
