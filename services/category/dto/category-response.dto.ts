import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the category response.
 *
 * @remarks
 * This DTO is the format of the response for category
 * queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a category to the
 * consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(CATEGORY_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CategoryResponseDTO {
  id: EntityId
  name: string
  createdAt: Date
  updatedAt: Date
}
