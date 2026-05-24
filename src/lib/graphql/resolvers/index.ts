import { GraphQLDateTime as DateTime } from "graphql-scalars";
import {
  Account as AccountType,
  Query as AccountQuery,
  Mutation as AccountMutation,
} from "./account";
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
  Account: AccountType,
  Trait: TraitType,
  Connection: ConnectionType,
  ConnectionGroup: ConnectionGroupType,
  Query: {
    ...AccountQuery,
    ...TraitQuery,
    ...ConnectionQuery,
    ...ConnectionGroupQuery,
  },
  Mutation: {
    ...AccountMutation,
    ...TraitMutation,
    ...ConnectionMutation,
    ...ConnectionGroupMutation,
  },
};
