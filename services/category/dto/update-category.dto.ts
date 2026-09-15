/**
 * @summary
 * Defines the payload for renaming a `Category`.
 *
 * @remarks
 * The provided name replaces the current name.
 *
 * @explanation
 * Use this DTO to rename an existing category through
 * the service layer.
 *
 * @example
 * const DTO: UpdateCategoryDTO = {
 *   name: "Renda Variável",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdateCategoryDTO {
  name: string
}
