interface CreateConnectionGroupInput {
  name: string
  traitIds?: string[]
}

interface UpdateConnectionGroupInput {
  name?: string
  traitIds?: string[]
}

export const connectionGroupService = {
  // Helper for type resolvers
  findById: (_id: string): unknown => {
    throw new Error('Not implemented')
  },
  // myConnectionGroups query, Account.connectionGroups resolver
  findByAccountId: (_accountId: string): unknown => {
    throw new Error('Not implemented')
  },
  // createConnectionGroup mutation
  create: (_accountId: string, _input: CreateConnectionGroupInput): unknown => {
    throw new Error('Not implemented')
  },
  // updateConnectionGroup mutation
  update: (_id: string, _input: UpdateConnectionGroupInput): unknown => {
    throw new Error('Not implemented')
  },
  // deleteConnectionGroup mutation
  delete: (_id: string): unknown => {
    throw new Error('Not implemented')
  },
  // addTraitToGroup mutation
  addTrait: (_groupId: string, _traitId: string): unknown => {
    throw new Error('Not implemented')
  },
  // removeTraitFromGroup mutation
  removeTrait: (_groupId: string, _traitId: string): unknown => {
    throw new Error('Not implemented')
  },
}
