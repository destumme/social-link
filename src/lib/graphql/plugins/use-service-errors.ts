import { mapSchema, MapperKind } from "@graphql-tools/utils";
import type { Plugin } from "graphql-yoga";
import { toGraphQLError } from "../errors";

export const useServiceErrors: Plugin = {
  onSchemaChange({ schema, replaceSchema }) {
    const newSchema = mapSchema(schema, {
      [MapperKind.OBJECT_FIELD](fieldConfig) {
        const originalResolve = fieldConfig.resolve;
        if (!originalResolve) return fieldConfig;

        fieldConfig.resolve = async (source, args, context, info) => {
          try {
            return await originalResolve(source, args, context, info);
          } catch (err) {
            throw toGraphQLError(err as Error);
          }
        };
        return fieldConfig;
      },
    });
    replaceSchema(newSchema);
  },
};
