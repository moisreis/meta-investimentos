import type { Category } from "@domain/category/entities/category.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `Category` entities.
 *
 * @remarks
 * An `ICategory` persists, retrieves, and removes categories.
 * Supports lookup by id and name.
 *
 * @explanation
 * Use this interface to implement data access for categories.
 * Persistence implementations map rows to `Category` entities.
 *
 * @example
 * const CAT = await CATEGORY_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface ICategory {
  /**
   * @summary
   * Retrieves the category with the provided id.
   *
   * @remarks
   * Returns null when no category matches.
   *
   * @explanation
   * Use this method to look up a single category by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the category.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const CAT = await CATEGORY_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Category | null>

  /**
   * @summary
   * Retrieves the category with the provided name.
   *
   * @remarks
   * Returns null when no category matches.
   *
   * @explanation
   * Use this method to look up a category by its
   * display name. Callers check null for existence.
   *
   * @param name - The name of the category.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const CAT = await CATEGORY_REPO.findByName(NAME);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByName(name: string): Promise<Category | null>

  /**
   * @summary
   * Retrieves all categories, optionally paginated.
   *
   * @remarks
   * Use limit and offset to paginate results.
   *
   * @explanation
   * Use this method to list all categories. Pass options
   * to paginate when the dataset is large.
   *
   * @param options - The pagination options.
   * @param options.limit - Maximum categories to return.
   * @param options.offset - Starting offset.
   *
   * @returns The matching entries.
   *
   * @example
   * const CATS = await CATEGORY_REPO.findAll();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<Category[]>

  /**
   * @summary
   * Retrieves all categories with the provided ids.
   *
   * @remarks
   * Returns an empty array when no categories match.
   *
   * @explanation
   * Use this method to fetch multiple categories by their
   * unique identifiers. Returns an empty array for
   * no matches.
   *
   * @param ids - The unique identifiers of the categories.
   *
   * @returns The matching entries.
   *
   * @example
   * const CATS = await CATEGORY_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByIds(ids: EntityId[]): Promise<Category[]>

  /**
   * @summary
   * Persists the provided category.
   *
   * @remarks
   * Inserts a new record when the category has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a category.
   * The persisted entity with its id is returned.
   *
   * @param category - The category to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const CAT = await CATEGORY_REPO.save(NEW_CAT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(category: Category): Promise<Category>

  /**
   * @summary
   * Removes the category with the provided id.
   *
   * @remarks
   * Resolves when the category is removed.
   *
   * @explanation
   * Use this method to delete a category record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the category.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await CATEGORY_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>

  /**
   * @summary
   * Removes the categories with the provided ids.
   *
   * @remarks
   * Resolves when the rows are removed.
   *
   * @explanation
   * Use this method to delete many categories in one
   * batched operation.
   *
   * @param ids - The unique identifiers of the categories.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await CATEGORY_REPO.deleteByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  deleteByIds(ids: EntityId[]): Promise<void>
}
