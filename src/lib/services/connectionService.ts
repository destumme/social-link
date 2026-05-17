interface RequestConnectionInput {
  groupIds?: string[]
  sharedTraitIds?: string[]
}

export const connectionService = {
  // Helper for type resolvers
  findById: (_id: string): unknown => {
    throw new Error('Not implemented')
  },
  // myConnections query, Account.connections resolver
  findByAccountId: (_accountId: string): unknown => {
    throw new Error('Not implemented')
  },
  // pendingConnections query
  findPendingByAccountId: (_accountId: string): unknown => {
    throw new Error('Not implemented')
  },
  // connectionByAccount query
  findByConnectedAccountId: (_accountId: string): unknown => {
    throw new Error('Not implemented')
  },
  // requestConnection mutation
  request: (_accountId: string, _targetAccountId: string, _input: RequestConnectionInput): unknown => {
    throw new Error('Not implemented')
  },
  // acceptConnection mutation
  accept: (_connectionId: string): unknown => {
    throw new Error('Not implemented')
  },
  // declineConnection mutation
  decline: (_connectionId: string): unknown => {
    throw new Error('Not implemented')
  },
  // removeConnection mutation
  delete: (_id: string): unknown => {
    throw new Error('Not implemented')
  },
  // addConnectionToGroup mutation
  addToGroup: (_connectionId: string, _groupId: string): unknown => {
    throw new Error('Not implemented')
  },
  // removeConnectionFromGroup mutation
  removeFromGroup: (_connectionId: string, _groupId: string): unknown => {
    throw new Error('Not implemented')
  },
  // updateConnectionTraits mutation
  updateTraits: (_connectionId: string, _traitIds: string[]): unknown => {
    throw new Error('Not implemented')
  },
}
