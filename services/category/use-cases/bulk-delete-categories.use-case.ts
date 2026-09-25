import { ICategory } from "@domain/category/interfaces/category.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteCategoriesInput {
  categoryIds: string[]
}

/**
 * @summary
 * Deletes multiple `Category` records.
 *
 * @remarks
 * Hydrates the categories by their ids and removes the
 * rows that still exist. Missing categories are silently
 * skipped.
 *
 * @explanation
 * Use this use case to remove many categories through
 * the service layer.
 *
 * @example
 * await BULK_DELETE_CATEGORIES_USE_CASE.execute({
 *   categoryIds: ["category-1", "category-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class BulkDeleteCategoriesUseCase {
  constructor(private categoryRepository: ICategory) {}

  /**
   * @summary
   * Removes the categories with the provided ids.
   *
   * @remarks
   * Hydrates the categories by their ids and removes
   * the rows that still exist. Missing categories are
   * silently skipped.
   *
   * @explanation
   * Use this method to delete many categories in one
   * operation.
   *
   * @param input - Payload with the target category ids.
   *
   * @returns Resolves when the remaining rows are
   *          removed.
   *
   * @example
   * await BULK_DELETE_CATEGORIES_USE_CASE.execute({
   *   categoryIds: ["category-1", "category-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: BulkDeleteCategoriesInput
  ): Promise<void> {
    if (input.categoryIds.length === 0) {
      return
    }

    const IDS = input.categoryIds.map((id) =>
      EntityId.create(id)
    )
    const CATEGORIES =
      await this.categoryRepository.findAllByIds(IDS)

    const FOUND_IDS = CATEGORIES.map(
      (category) => category.id
    ).filter((id): id is EntityId => Boolean(id))

    if (FOUND_IDS.length === 0) {
      return
    }

    await this.categoryRepository.deleteByIds(FOUND_IDS)
  }
}
