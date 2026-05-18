import { Account } from "@/generated/prisma/client";
import { prisma } from "@/lib/database/prisma";
import { NotFoundError } from "@/lib/errors";

interface CreateAccountInput {
  displayName: string;
  username: string;
}

interface UpdateAccountInput {
  displayName?: string;
  username?: string;
  publicListed?: boolean;
}

export const accountService = {
  /**
   * Create a new account.
   * @param input - The account creation data.
   * @returns The created account.
   */
  create: async (input: CreateAccountInput): Promise<Account> => {
    return prisma.account.create({
      data: {
        ...input,
        publicListed: false,
      },
    });
  },

  /**
   * Helper for type resolvers.
   * @param id - The account ID.
   * @returns The account or null.
   */
  findById: async (id: string): Promise<Account> => {
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
    });

    if (account === null) {
      throw new NotFoundError("Account not found", { domain: "accounts" });
    }

    return account;
  },

  /**
   * accountByUsername query. This is an exact username lookup.
   * @param username - The exact username.
   * @returns The account or null.
   */
  findByUsername: async (username: string): Promise<unknown> => {
    const account = await prisma.account.findUnique({
      where: {
        username,
        publicListed: true,
      },
    });

    if (account === null) {
      throw new NotFoundError("Account not found", { domain: "accounts" });
    }

    return account;
  },

  /**
   * accountByShareId query.
   * @param shareId - The share ID.
   * @returns The account or null.
   */
  findByShareId: async (_shareId: string): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * me query (BetterAuth).
   * @param authId - The BetterAuth session ID.
   * @returns The account or null.
   */
  findByAuthId: async (authId: string): Promise<unknown> => {
    throw new Error("Not implemented");
  },

  /**
   * searchAccounts query. This is a typeahead lookup on the account username.
   * @param query - The search query string.
   * @returns Array of matching accounts.
   */
  search: async (query: string): Promise<Account[]> => {
    return prisma.account.findMany({
      where: {
        publicListed: true,
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
    });
  },

  /**
   * updateAccount mutation.
   * @param id - The account ID.
   * @param input - The update fields.
   * @returns The updated account.
   */
  update: async (id: string, input: UpdateAccountInput): Promise<Account> => {
    const account = await prisma.account.findUnique({ where: { id } });
    if (account === null) {
      throw new NotFoundError("Account not found", { domain: "accounts" });
    }
    return prisma.account.update({
      where: { id },
      data: input,
    });
  },
};
