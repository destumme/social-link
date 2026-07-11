import type { Resolvers } from "@/generated/graphql/server";
import { DateTime } from "./scalars";
import { User, Query as UserQuery, Mutation as UserMutation } from "./user";
import { Trait, Query as TraitQuery, Mutation as TraitMutation } from "./trait";
import {
  Connection,
  ConnectionSide,
  Query as ConnectionQuery,
  Mutation as ConnectionMutation,
} from "./connection";
import {
  ConnectionGroup,
  Query as ConnectionGroupQuery,
  Mutation as ConnectionGroupMutation,
} from "./connectionGroup";

export const resolvers: Resolvers = {
  DateTime,
  Query: {
    ...UserQuery,
    ...TraitQuery,
    ...ConnectionQuery,
    ...ConnectionGroupQuery,
  },
  Mutation: {
    ...UserMutation,
    ...TraitMutation,
    ...ConnectionMutation,
    ...ConnectionGroupMutation,
  },
  User,
  Trait,
  Connection,
  ConnectionSide,
  ConnectionGroup,
};
