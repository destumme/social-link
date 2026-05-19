import { Trait } from "@/generated/prisma/client";
import { prisma } from "@/lib/database/prisma";

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
   * Find traits that the accountId has made visible to the authedAccountId
   * @param accountId
   * @param connectionAccountId
   */
  findVisibleTraits: async (
    accountId: string,
    authedAccountId: string,
  ): Promise<Trait[]> => {
    const traits = await prisma.trait.findMany({
      where: {
        visibleGroups: {
          some: {
            accountId: authedAccountId,
            AND: {
              connections: {
                some: {
                  accountId,
                },
              },
            },
          },
        },
      },
    });

    return traits;
  },

  /**
   * Find traits by account ID.
   * @param accountId - The account ID.
   * @returns Array of traits for the account.
   */
  findByAccountId: async (accountId: string): Promise<Trait[]> => {
    return prisma.trait.findMany({
      where: {
        accountId,
      },
    });
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
