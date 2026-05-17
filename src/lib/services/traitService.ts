interface CreateTraitInput {
  key: string
  value: string
  category: 'PHONE_NUMBER' | 'EMAIL' | 'SOCIAL_MEDIA_LINK' | 'WEBSITE_LINK'
  icon?: string
}

interface UpdateTraitInput {
  key?: string
  value?: string
  category?: 'PHONE_NUMBER' | 'EMAIL' | 'SOCIAL_MEDIA_LINK' | 'WEBSITE_LINK'
  icon?: string
}

export const traitService = {
  // traitById query
  findById: (_id: string): unknown => {
    throw new Error('Not implemented')
  },
  // myTraits query, Account.traits resolver
  findByAccountId: (_accountId: string): unknown => {
    throw new Error('Not implemented')
  },
  // createTrait mutation
  create: (_accountId: string, _input: CreateTraitInput): unknown => {
    throw new Error('Not implemented')
  },
  // updateTrait mutation
  update: (_id: string, _input: UpdateTraitInput): unknown => {
    throw new Error('Not implemented')
  },
  // deleteTrait mutation
  delete: (_id: string): unknown => {
    throw new Error('Not implemented')
  },
}
