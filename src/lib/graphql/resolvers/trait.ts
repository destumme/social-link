import type {
  TraitResolvers,
  QueryResolvers,
  MutationResolvers,
} from "@/generated/graphql/server";
import traitService from "@/lib/services/traitService";

export const Trait: TraitResolvers = {
  /**
   * Resolves the `account` field on the Trait type.
   * Fetches the owning user account for this trait.
   *
   * @param parent - The parent Trait object.
   * @returns The user account that owns this trait.
   * @throws {Error} If the trait has no accountId or the account is not found.
   */
  account: async (parent) => {
    if (!parent.accountId) throw new Error("Trait has no accountId");
    const account = await traitService.search.findAccountForTrait(
      parent.accountId,
    );
    if (!account) throw new Error("Account not found for trait");
    return account;
  },
  /**
   * Resolves the `visibleGroups` field on the Trait type.
   * Returns the connection groups this trait is visible to.
   *
   * @param parent - The parent Trait object.
   * @returns An array of connection groups linked to this trait.
   */
  visibleGroups: (parent) => {
    return traitService.search.findVisibleGroupsForTrait(parent.id);
  },
};

export const Query: Pick<QueryResolvers, "myTraits" | "traitById"> = {
  /**
   * Resolves the `myTraits` query. Returns all traits for the authenticated user.
   *
   * @returns An array of the authenticated user's traits.
   * @throws {AuthenticationError} If not authenticated.
   */
  myTraits: async () => {
    return traitService.search.findTraitsByAccountId();
  },
  /**
   * Resolves the `traitById` query. Finds a single trait by ID.
   *
   * @param _parent - Root value (unused).
   * @param args - Query arguments containing `id`.
   * @returns The trait record, or `null` if not found.
   */
  traitById: (_parent, args) => {
    return traitService.trait.findTraitById(args.id);
  },
};

export const Mutation: Pick<
  MutationResolvers,
  "createTrait" | "updateTrait" | "deleteTrait"
> = {
  /**
   * Resolves the `createTrait` mutation. Creates a new trait for the authenticated user.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `input` with key, value, category, and optional icon.
   * @returns The newly created trait record.
   * @throws {AuthenticationError} If not authenticated.
   */
  createTrait: async (_parent, args) => {
    return traitService.trait.createTrait({
      ...args.input,
      icon: args.input.icon ?? undefined,
    });
  },
  /**
   * Resolves the `updateTrait` mutation. Updates an existing trait owned by the authenticated user.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `id` and `input` with optional fields.
   * @returns The updated trait record.
   * @throws {AuthenticationError} If not authenticated.
   * @throws {NotFoundError} If the trait does not exist.
   * @throws {AuthorizationError} If the trait is not owned by the authenticated user.
   */
  updateTrait: async (_parent, args) => {
    const { key, value, category, icon, isVisible } = args.input;
    return traitService.trait.updateTrait(args.id, {
      key: key ?? undefined,
      value: value ?? undefined,
      category: category ?? undefined,
      icon: icon ?? undefined,
      isVisible: isVisible ?? undefined,
    });
  },
  /**
   * Resolves the `deleteTrait` mutation. Deletes a trait owned by the authenticated user.
   *
   * @param _parent - Root value (unused).
   * @param args - Mutation arguments containing `id`.
   * @returns `true` on successful deletion.
   * @throws {AuthenticationError} If not authenticated.
   * @throws {NotFoundError} If the trait does not exist.
   * @throws {AuthorizationError} If the trait is not owned by the authenticated user.
   */
  deleteTrait: async (_parent, args) => {
    await traitService.trait.deleteTrait(args.id);
    return true;
  },
};
