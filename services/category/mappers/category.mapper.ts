import {
  Category,
  type CategoryProps,
} from "@domain/category/entities/category.entity"
import type { CreateCategoryDTO } from "../dto/create-category.dto"
import type { CategoryResponseDTO } from "../dto/category-response.dto"

/**
 * @summary
 * Maps a create `Category` DTO into entity props.
 *
 * @remarks
 * The name is a plain string already accepted by the
 * entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props for `Category.create`.
 */
export function toCreateCategoryProps(dto: CreateCategoryDTO): CategoryProps {
  return {
    name: dto.name,
  }
}

/**
 * @summary
 * Maps a `Category` entity into a response DTO.
 *
 * @remarks
 * Serializes the id to a string and timestamps to
 * ISO 8601 strings.
 *
 * @param entity - The category domain entity.
 * @returns Response DTO payload.
 */
export function toResponseDTO(entity: Category): CategoryResponseDTO {
  return {
    id: entity.id as string,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
