import { createSchema, createYoga, useLogger } from "graphql-yoga";
import { schema } from "@/lib/graphql";
import { createContext } from "@/lib/graphql/resolvers/context";



const { handleRequest } = createYoga({
  schema: createSchema(schema),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  context: ({ request }) => createContext(request),
  // plugins: [
  //   useLogger(logger)
  // ]
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
