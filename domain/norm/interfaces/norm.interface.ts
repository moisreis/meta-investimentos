import type { Norm } from "@domain/norm/entities/norm.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `Norm` entities.
 *
 * @remarks
 * An `INorm` persists, retrieves, and removes norms.
 * Supports lookup by id and category id.
 *
 * @explanation
 * Use this interface to implement data access for norms.
 * Persistence implementations map rows to `Norm` entities.
 *
 * @example
 * const NORM = await NORM_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface INorm {
  /**
   * @summary
   * Retrieves the norm with the provided id.
   *
   * @remarks
   * Returns null when no norm matches.
   *
   * @explanation
   * Use this method to look up a single norm by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the norm.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const NORM = await NORM_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Norm | null>

  /**
   * @summary
   * Retrieves all norms belonging to the provided category.
   *
   * @remarks
   * Returns an empty array when no norms match.
   *
   * @explanation
   * Use this method to list all norms linked to a
   * category. Returns an empty array for no matches.
   *
   * @param categoryId - The unique identifier of the category.
   *
   * @returns The matching entries.
   *
   * @example
   * const NORMS = await NORM_REPO.findAllByCategoryId(CAT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByCategoryId(categoryId: EntityId): Promise<Norm[]>

  /**
   * @summary
   * Retrieves all norms belonging to the provided categories.
   *
   * @remarks
   * Returns an empty array when no norms match.
   *
   * @explanation
   * Use this method to list norms linked to several
   * categories. Returns an empty array for no matches.
   *
   * @param categoryIds - The identifiers of the categories.
   *
   * @returns The matching entries.
   *
   * @example
   * const NORMS = await NORM_REPO
   *   .findAllByCategoryIds(CATEGORY_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByCategoryIds(categoryIds: EntityId[]): Promise<Norm[]>

  /**
   * @summary
   * Persists the provided norm.
   *
   * @remarks
   * Inserts a new record when the norm has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a norm record.
   * The persisted entity with its id is returned.
   *
   * @param norm - The norm to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const NORM = await NORM_REPO.save(NEW_NORM);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(norm: Norm): Promise<Norm>

  /**
   * @summary
   * Removes the norm with the provided id.
   *
   * @remarks
   * Resolves when the norm is removed.
   *
   * @explanation
   * Use this method to delete a norm record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the norm.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await NORM_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
