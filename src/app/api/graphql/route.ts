import { readFileSync } from "node:fs";
import {
  createYoga,
  useLogger,
  createSchema,
  type YogaServerInstance,
} from "graphql-yoga";
import { createContext, GraphQLContext } from "@/lib/graphql/resolvers/context";
import { useServiceErrors } from "@/lib/graphql/plugins/use-service-errors";
import { resolvers } from "@/lib/graphql/resolvers";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

const typeDefs = readFileSync("./src/lib/graphql/schema.graphql", "utf8");

const schema = createSchema({ typeDefs, resolvers });

const yoga: YogaServerInstance<
  Record<string, unknown>,
  GraphQLContext
> = createYoga<Record<string, unknown>, GraphQLContext>({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  context: async ({ request }) => createContext(request),
  maskedErrors: process.env.NODE_ENV !== "test",
  plugins: [
    useServiceErrors,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLogger({
      skipIntrospection: true,
      logFn: (event, args) =>
        logger.debug({ event, args }, "graphql-yoga handler"),
    }),
  ],
});

const NextHandler = (request: NextRequest) => yoga.handleRequest(request, {});

export {
  NextHandler as GET,
  NextHandler as POST,
  NextHandler as OPTIONS,
  yoga,
};
