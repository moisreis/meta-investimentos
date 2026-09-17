import { Category } from "@domain/category/entities/category.entity"
import { ICategory } from "@domain/category/interfaces/category.interface"
import type { CategoryResponseDTO } from "../dto/category-response.dto"
import { toCreateCategoryProps, toResponseDTO } from "../mappers/category.mapper"

export interface CreateCategoryInput {
  name: string
}

/**
 * @summary
 * Creates a new `Category` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the category with the category repository.
 *
 * @explanation
 * Use this use case to register a new category through
 * the service layer.
 *
 * @example
 * const CATEGORY = await CREATE_CATEGORY_USE_CASE.execute({
 *   name: "Renda Fixa",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategory) {}

  /**
   * @summary
   * Creates and persists a new category.
   *
   * @param input - The category creation payload.
   * @returns The persisted category response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: CreateCategoryInput): Promise<CategoryResponseDTO> {
    const PROPS = toCreateCategoryProps(input)
    const CATEGORY = Category.create(PROPS)
    const SAVED = await this.categoryRepository.save(CATEGORY)
    return toResponseDTO(SAVED)
  }
}