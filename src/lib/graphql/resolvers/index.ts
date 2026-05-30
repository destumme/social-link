import { GraphQLDateTime as DateTime } from "graphql-scalars";
import {
  User as UserType,
  Query as UserQuery,
  Mutation as UserMutation,
} from "./user";
import {
  Trait as TraitType,
  Query as TraitQuery,
  Mutation as TraitMutation,
} from "./trait";
import {
  Connection as ConnectionType,
  Query as ConnectionQuery,
  Mutation as ConnectionMutation,
} from "./connection";
import {
  ConnectionGroup as ConnectionGroupType,
  Query as ConnectionGroupQuery,
  Mutation as ConnectionGroupMutation,
} from "./connectionGroup";
import { GraphQLContext } from "./context";

export const resolvers = {
  DateTime,
  User: UserType,
  Trait: TraitType,
  Connection: ConnectionType,
  ConnectionGroup: ConnectionGroupType,
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
};
