import { ICategory } from "@domain/category/interfaces/category.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { CategoryResponseDTO } from "../dto/category-response.dto"
import { toResponseDTO } from "../mappers/category.mapper"

export interface GetCategoryInput {
  categoryId: string
}

/**
 * @summary
 * Retrieves an existing `Category` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no category matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single category through
 * the service layer.
 *
 * @example
 * const CATEGORY = await GET_CATEGORY_USE_CASE.execute({
 *   categoryId: "category-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetCategoryUseCase {
  constructor(private categoryRepository: ICategory) {}

  /**
   * @summary
   * Fetches the category with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no category matches the
   * provided id.
   *
   * @explanation
   * Use this method to fetch a single category through
   * the service layer.
   *
   * @param input - Payload with the target category id.
   *
   * @returns The matching category.
   *
   * @example
   * const CATEGORY = await GET_CATEGORY_USE_CASE.execute({
   *   categoryId: "category-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: GetCategoryInput): Promise<CategoryResponseDTO> {
    const ID = EntityId.create(input.categoryId)
    const CATEGORY = await this.categoryRepository.findById(ID)
    if (!CATEGORY) {
      throw new NotFoundError("`Category` not found.")
    }
    return toResponseDTO(CATEGORY)
  }
}
