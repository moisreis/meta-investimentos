import { ICategory } from "@domain/category/interfaces/category.interface"
import type { CategoryResponseDTO } from "../dto/category-response.dto"
import { toResponseDTO } from "../mappers/category.mapper"

export interface ListCategoriesInput {
  limit?: number
  offset?: number
}

/**
 * @summary
 * Lists all registered `Category` entries.
 *
 * @remarks
 * Supports optional pagination through limit and
 * offset.
 *
 * @explanation
 * Use this use case to list categories through the
 * service layer.
 *
 * @example
 * const CATEGORIES = await LIST_CATEGORIES_USE_CASE.execute({});
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListCategoriesUseCase {
  constructor(private categoryRepository: ICategory) {}

  /**
   * @summary
   * Fetches all categories, optionally paginated.
   *
   * @remarks
   * Supports optional pagination through limit and
   * offset.
   *
   * @explanation
   * Use this method to list categories through the
   * service layer.
   *
   * @param input - Pagination options.
   *
   * @returns The matching categories.
   *
   * @example
   * const CATEGORIES = await LIST_CATEGORIES_USE_CASE
   *   .execute();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListCategoriesInput
  ): Promise<CategoryResponseDTO[]> {
    const CATEGORIES = await this.categoryRepository.findAll({
      limit: input.limit,
      offset: input.offset,
    })
    return CATEGORIES.map(toResponseDTO)
  }
}
