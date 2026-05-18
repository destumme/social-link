import { createSchema, createYoga } from "graphql-yoga";
import { schema } from "@/lib/graphql";
import { createContext } from "@/lib/graphql/resolvers/context";

const { handleRequest } = createYoga({
  schema: createSchema(schema),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  context: ({ request }) => createContext(request),
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
