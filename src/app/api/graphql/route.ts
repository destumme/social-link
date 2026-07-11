import { readFileSync } from "node:fs";
import { createYoga, useLogger, createSchema } from "graphql-yoga";
import { createContext, GraphQLContext } from "@/lib/graphql/resolvers/context";
import { useServiceErrors } from "@/lib/graphql/plugins/use-service-errors";
import { resolvers } from "@/lib/graphql/resolvers";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

const typeDefs = readFileSync("./src/lib/graphql/schema.graphql", "utf8");

const schema = createSchema<GraphQLContext>({ typeDefs, resolvers });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const yoga = createYoga<any, GraphQLContext>({
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
