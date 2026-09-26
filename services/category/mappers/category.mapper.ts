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
 * @explanation
 * Use this function to translate the service payload
 * into valid entity props.
 *
 * @param dto - Transport payload from the service layer.
 *
 * @returns Entity creation props.
 *
 * @example
 * const PROPS = toCreateCategoryProps(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toCreateCategoryProps(
  dto: CreateCategoryDTO
): CategoryProps {
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
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The category domain entity.
 *
 * @returns Response DTO payload.
 *
 * @example
 * const RESPONSE = toResponseDTO(ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toResponseDTO(
  entity: Category
): CategoryResponseDTO {
  return {
    id: entity.id as string,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
