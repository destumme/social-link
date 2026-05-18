interface CreateTraitInput {
  key: string;
  value: string;
  category: "PHONE_NUMBER" | "EMAIL" | "SOCIAL_MEDIA_LINK" | "WEBSITE_LINK";
  icon?: string;
}

interface UpdateTraitInput {
  key?: string;
  value?: string;
  category?: "PHONE_NUMBER" | "EMAIL" | "SOCIAL_MEDIA_LINK" | "WEBSITE_LINK";
  icon?: string;
}

export const traitService = {
  /**
   * traitById query.
   * @param id - The trait ID.
   * @returns The trait or null.
   */
  findById: async (_id: string): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * myTraits query, Account.traits resolver.
   * @param accountId - The account ID.
   * @returns Array of traits.
   */
  findByAccountId: async (_accountId: string): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * createTrait mutation.
   * @param accountId - The account ID.
   * @param input - The trait creation data.
   * @returns The created trait.
   */
  create: async (
    _accountId: string,
    _input: CreateTraitInput,
  ): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * updateTrait mutation.
   * @param id - The trait ID.
   * @param input - The update fields.
   * @returns The updated trait.
   */
  update: async (_id: string, _input: UpdateTraitInput): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * deleteTrait mutation.
   * @param id - The trait ID.
   * @returns True if deleted.
   */
  delete: async (_id: string): Promise<boolean> => {
    throw new Error("Not implemented");
  },
};
