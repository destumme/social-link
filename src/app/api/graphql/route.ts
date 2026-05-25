import {
  createSchema,
  createYoga,
  useLogger,
  type YogaServerInstance,
} from "graphql-yoga";
import { schema } from "@/lib/graphql";
import { createContext, GraphQLContext } from "@/lib/graphql/resolvers/context";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const yoga: YogaServerInstance<any, GraphQLContext> = createYoga<
  any,
  GraphQLContext
>({
  schema: createSchema(schema),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  context: async ({ request }) => createContext(request),
  maskedErrors: process.env.NODE_ENV !== "test",
  plugins: [
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLogger({
      skipIntrospection: true,
      logFn: (event, args) =>
        logger.debug({ event, args }, "graphql-yoga handler"),
    }),
  ],
});

//Nextjs Context for route handler is the url params, yoga request context is a context factory function
const NextHandler = (request: NextRequest) => yoga.handleRequest(request, {});

export {
  NextHandler as GET,
  NextHandler as POST,
  NextHandler as OPTIONS,
  yoga,
};
