/**
 * @summary
 * Defines the payload for creating a `Category`.
 *
 * @remarks
 * The name must be unique.
 *
 * @explanation
 * Use this DTO to create a category through the service
 * layer.
 *
 * @example
 * const DTO: CreateCategoryDTO = {
 *   name: "Renda Fixa",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateCategoryDTO {
  name: string
}
