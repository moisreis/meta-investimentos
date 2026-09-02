import type { Norm } from "@/business/entities/portfolio/norm.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `Norm` entities.
 *
 * An `INorm`:
 * - persists norms through {@link INorm.save}.
 * - retrieves norms by id and category id.
 * - removes norms by id.
 *
 * Implementations are responsible for mapping database rows to `Norm`
 * entities and back.
 */
export interface INorm {
  /**
   * Retrieves the norm with the provided id.
   *
   * @param id - The unique identifier of the norm.
   * @returns A promise resolving to the `Norm` or `null` when not found.
   */
  findById(id: EntityId): Promise<Norm | null>;

  /**
   * Retrieves all norms belonging to the provided category id.
   *
   * @param categoryId - The unique identifier of the category.
   * @returns A promise resolving to the `Norm` entries or an empty array
   * when there are no matches.
   */
  findAllByCategoryId(categoryId: EntityId): Promise<Norm[]>;

  /**
   * Persists the provided norm.
   *
   * When the norm has no id, the implementation inserts a new record and
   * the persisted `Norm` (with its generated id) is returned; otherwise
   * the existing record is updated.
   *
   * @param norm - The norm to persist.
   * @returns A promise resolving to the persisted `Norm`.
   */
  save(norm: Norm): Promise<Norm>;

  /**
   * Removes the norm with the provided id.
   *
   * @param id - The unique identifier of the norm.
   * @returns A promise that resolves when the norm is removed.
   */
  delete(id: EntityId): Promise<void>;
}
