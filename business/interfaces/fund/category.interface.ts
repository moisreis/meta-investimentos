import type { Category } from "@/business/entities/fund/category.entity";

/**
 * Represents the repository contract for persisting and retrieving
 * `Category` entities.
 *
 * An `ICategory`:
 * - persists categories through {@link ICategory.save}.
 * - retrieves categories by id and name.
 * - removes categories by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Category` entities and back.
 */
export interface ICategory {
  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the category with the provided id.
   *
   * @param id - The unique identifier of the category.
   * @returns A promise resolving to the `Category` or `null` when
   * not found.
   */
  findById(id: string): Promise<Category | null>;

  /**
   * Retrieves the category with the provided name.
   *
   * @param name - The name of the category.
   * @returns A promise resolving to the `Category` or `null` when
   * not found.
   */
  findByName(name: string): Promise<Category | null>;

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided category.
   *
   * When the category has no id, the implementation inserts a new
   * record and the persisted `Category` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param category - The category to persist.
   * @returns A promise resolving to the persisted `Category`.
   */
  save(category: Category): Promise<Category>;

  /**
   * Removes the category with the provided id.
   *
   * @param id - The unique identifier of the category.
   * @returns A promise that resolves when the category is removed.
   */
  delete(id: string): Promise<void>;
}
