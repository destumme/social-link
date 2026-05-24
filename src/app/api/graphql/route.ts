import {
  createSchema,
  createYoga,
  useErrorHandler,
  useLogger,
} from "graphql-yoga";
import { schema } from "@/lib/graphql";
import { createContext, GraphQLContext } from "@/lib/graphql/resolvers/context";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

const { handleRequest } = createYoga<any, GraphQLContext>({
  schema: createSchema(schema),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  context: async ({ request }) => createContext(request),
  plugins: [
    useLogger({
      skipIntrospection: true,
      logFn: (event, args) =>
        logger.debug({ event, args }, "graphql-yoga handler"),
    }),
  ],
});

//Nextjs Context for route handler is the url params, yoga request context is a context factory function
const NextHandler = (request: NextRequest) => handleRequest(request, {});

export { NextHandler as GET, NextHandler as POST, NextHandler as OPTIONS };
