import { yoga } from "@/app/api/graphql/route";
import { headers } from "next/headers";

export async function executeGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const reqHeaders = await headers();

  const response = await yoga.fetch("http://localhost/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: reqHeaders.get("cookie") ?? "",
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();
  if (errors?.length) throw errors[0];
  return data as T;
}
