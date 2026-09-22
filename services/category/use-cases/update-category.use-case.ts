import { ICategory } from "@domain/category/interfaces/category.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { CategoryResponseDTO } from "../dto/category-response.dto"
import { toResponseDTO } from "../mappers/category.mapper"

export interface UpdateCategoryInput {
  categoryId: string
  name: string
}

/**
 * @summary
 * Updates an existing `Category`.
 *
 * @remarks
 * Fetches the category, applies `rename` with the new
 * name, and persists the updated entity.
 *
 * @explanation
 * Use this use case to rename an existing category
 * through the service layer.
 *
 * @example
 * const CATEGORY = await UPDATE_CATEGORY_USE_CASE.execute({
 *   categoryId: "category-1",
 *   name: "Renda Variável",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategory) {}

  /**
   * @summary
   * Updates and persists a category.
   *
   * @remarks
   * Fetches the category, applies `rename` with the new
   * name, and persists the updated entity.
   *
   * @explanation
   * Use this method to rename an existing category
   * through the service layer.
   *
   * @param input - Payload with the target category id
   *                and the new name.
   *
   * @returns The updated category.
   *
   * @example
   * const CATEGORY = await UPDATE_CATEGORY_USE_CASE.execute({
   *   categoryId: "category-1",
   *   name: "Renda Variável",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: UpdateCategoryInput): Promise<CategoryResponseDTO> {
    const ID = EntityId.create(input.categoryId)
    const CATEGORY = await this.categoryRepository.findById(ID)
    if (!CATEGORY) {
      throw new NotFoundError("`Category` not found.")
    }
    const UPDATED = CATEGORY.rename(input.name)
    const SAVED = await this.categoryRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}
