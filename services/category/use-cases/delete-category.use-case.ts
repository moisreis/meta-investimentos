import { ICategory } from "@domain/category/interfaces/category.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteCategoryInput {
  categoryId: string
}

/**
 * @summary
 * Deletes an existing `Category`.
 *
 * @remarks
 * Fetches the category and removes it when it exists.
 * Throws **NotFoundError** when no category matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove a category through the
 * service layer.
 *
 * @example
 * await DELETE_CATEGORY_USE_CASE.execute({
 *   categoryId: "category-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategory) {}

  /**
   * @summary
   * Deletes the category with the provided id.
   *
   * @remarks
   * Fetches the category and removes it when it exists.
   * Throws **NotFoundError** when no category matches
   * the provided id.
   *
   * @explanation
   * Use this method to remove a category through the
   * service layer.
   *
   * @param input - Payload with the target category id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_CATEGORY_USE_CASE.execute({
   *   categoryId: "category-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(input: DeleteCategoryInput): Promise<void> {
    const ID = EntityId.create(input.categoryId)
    const CATEGORY = await this.categoryRepository.findById(ID)

    if (!CATEGORY) {
      throw new NotFoundError("`Category` not found.")
    }

    await this.categoryRepository.delete(ID)
  }
}
