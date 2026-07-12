import { TraitCategory } from "@/generated/prisma/enums";
import { prisma } from "@/lib/database/prisma";
import { getAuthedAccountId } from "@/lib/auth-server";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./errors";

/**
 * Checks the current session and returns the authenticated account ID.
 *
 * @returns The authenticated account's ID.
 * @throws {AuthenticationError} If no valid session exists.
 */
async function requireAuth() {
  const accountId = await getAuthedAccountId();
  if (!accountId) throw new AuthenticationError("Not authenticated");
  return accountId;
}

/**
 * Retrieves all traits belonging to the authenticated user.
 *
 * @returns An array of the authenticated user's traits.
 * @throws {AuthenticationError} If not authenticated.
 */
async function findTraitsByAccountId() {
  const accountId = await requireAuth();
  return prisma.trait.findMany({ where: { accountId } });
}

/**
 * Finds a trait by its unique ID.
 *
 * @param id - The trait's unique identifier.
 * @returns The trait record, or `null` if not found.
 */
function findTraitById(id: string) {
  return prisma.trait.findUnique({ where: { id } });
}

/**
 * Creates a new trait for the authenticated user.
 *
 * @param data - The trait data including key, value, category, and optional icon.
 * @returns The newly created trait record.
 * @throws {AuthenticationError} If not authenticated.
 */
async function createTrait(data: {
  key: string;
  value: string;
  category: TraitCategory;
  icon?: string;
}) {
  const accountId = await requireAuth();
  return prisma.trait.create({
    data: {
      ...data,
      accountId,
    },
  });
}

/**
 * Updates an existing trait owned by the authenticated user.
 *
 * Verifies ownership before updating. If setting `isVisible` to `true`,
 * also checks that the user's profile is publicly listed.
 *
 * @param id - The trait's unique identifier.
 * @param data - The fields to update (key, value, category, icon, isVisible).
 * @returns The updated trait record.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the trait does not exist.
 * @throws {AuthorizationError} If the trait is not owned by the authenticated user,
 *   or if attempting to make a trait visible on a non-public profile.
 */
async function updateTrait(
  id: string,
  data: {
    key?: string;
    value?: string;
    category?: TraitCategory;
    icon?: string;
    isVisible?: boolean;
  },
) {
  const accountId = await requireAuth();
  const trait = await prisma.trait.findUnique({ where: { id } });

  if (!trait) throw new NotFoundError("Trait not found");
  if (trait.accountId !== accountId)
    throw new AuthorizationError("Not authorized");

  if (data.isVisible === true) {
    const user = await prisma.user.findUnique({ where: { id: accountId } });

    if (!user || !user.publicListed) {
      throw new AuthorizationError(
        "Cannot make trait visible when profile is not public",
      );
    }
  }

  return prisma.trait.update({ where: { id }, data });
}

/**
 * Deletes a trait owned by the authenticated user.
 *
 * Verifies ownership before deleting.
 *
 * @param id - The trait's unique identifier.
 * @returns The deleted trait record.
 * @throws {AuthenticationError} If not authenticated.
 * @throws {NotFoundError} If the trait does not exist.
 * @throws {AuthorizationError} If the trait is not owned by the authenticated user.
 */
async function deleteTrait(id: string) {
  const accountId = await requireAuth();
  const trait = await prisma.trait.findUnique({ where: { id } });

  if (!trait) throw new NotFoundError("Trait not found");
  if (trait.accountId !== accountId)
    throw new AuthorizationError("Not authorized");

  return prisma.trait.delete({ where: { id } });
}

/**
 * Finds all connection groups that a trait is visible to.
 *
 * @param traitId - The trait's unique identifier.
 * @returns An array of connection groups linked to the trait.
 */
function findVisibleGroupsForTrait(traitId: string) {
  return prisma.connectionGroup.findMany({
    where: { traits: { some: { id: traitId } } },
  });
}

/**
 * Finds the user account that owns a trait.
 *
 * @param accountId - The account ID associated with the trait.
 * @returns The user record, or `null` if not found.
 */
function findAccountForTrait(accountId: string) {
  return prisma.user.findUnique({ where: { id: accountId } });
}

export const trait = { findTraitById, createTrait, updateTrait, deleteTrait };
export const search = {
  findTraitsByAccountId,
  findVisibleGroupsForTrait,
  findAccountForTrait,
};

const service = { trait, search };
export default service;
