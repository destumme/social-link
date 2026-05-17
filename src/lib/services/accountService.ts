interface UpdateAccountInput {
  displayName?: string
  username?: string
  publicListed?: boolean
}

export const accountService = {
  // Helper for type resolvers
  findById: (_id: string): unknown => {
    throw new Error('Not implemented')
  },
  // accountByUsername query
  findByUsername: (_username: string): unknown => {
    throw new Error('Not implemented')
  },
  // accountByShareId query
  findByShareId: (_shareId: string): unknown => {
    throw new Error('Not implemented')
  },
  // me query (BetterAuth)
  findByAuthId: (_authId: string): unknown => {
    throw new Error('Not implemented')
  },
  // searchAccounts query
  search: (_query: string): unknown => {
    throw new Error('Not implemented')
  },
  // updateAccount mutation
  update: (_id: string, _input: UpdateAccountInput): unknown => {
    throw new Error('Not implemented')
  },
}
