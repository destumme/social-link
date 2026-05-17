import { GraphQLScalarType, Kind } from 'graphql'
import { Account as AccountType, Query as AccountQuery, Mutation as AccountMutation } from './account'
import { Trait as TraitType, Query as TraitQuery, Mutation as TraitMutation } from './trait'
import { Connection as ConnectionType, Query as ConnectionQuery, Mutation as ConnectionMutation } from './connection'
import { ConnectionGroup as ConnectionGroupType, Query as ConnectionGroupQuery, Mutation as ConnectionGroupMutation } from './connectionGroup'

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime scalar',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString()
    }
    throw new Error('DateTime must be a Date')
  },
  parseValue(value) {
    if (typeof value === 'string') {
      return new Date(value)
    }
    throw new Error('DateTime must be a string')
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    throw new Error('DateTime must be a string')
  },
})

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
}
