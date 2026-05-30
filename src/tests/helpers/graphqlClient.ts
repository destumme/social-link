import { createClient, fetchExchange } from "@urql/core";
import { yoga } from "@/app/api/graphql/route";

export function createTestGraphQLClient(authedUserId: string) {
  const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const previousUserId = process.env.TEST_AUTHED_USER_ID;
    process.env.TEST_AUTHED_USER_ID = authedUserId;

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

    const request = new Request("http://localhost/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const response = await yoga.fetch(request);

    if (previousUserId === undefined) {
      delete process.env.TEST_AUTHED_USER_ID;
    } else {
      process.env.TEST_AUTHED_USER_ID = previousUserId;
    }

    return response;
  };

  return createClient({
    url: "http://localhost/api/graphql",
    exchanges: [fetchExchange],
    fetch: customFetch,
  });
}
