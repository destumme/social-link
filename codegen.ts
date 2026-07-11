import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/lib/graphql/schema.graphql",
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  generates: {
    "src/generated/graphql/server.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        mappers: {
          User: "@/generated/prisma/models/User#UserModel",
          Trait: "@/generated/prisma/models/Trait#TraitModel",
          Connection: "@/generated/prisma/models/Connection#ConnectionModel",
          ConnectionSide:
            "@/generated/prisma/models/ConnectionSide#ConnectionSideModel",
          ConnectionGroup:
            "@/generated/prisma/models/ConnectionGroup#ConnectionGroupModel",
        },
        scalars: {
          DateTime: { input: "Date | string", output: "Date | string" },
        },
      },
    },
    "src/generated/graphql/client/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        scalars: {
          DateTime: "Date | string",
        },
      },
    },
  },
};
export default config;
