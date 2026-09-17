/**
 * @summary
 * Defines the payload for updating a `Fund`.
 *
 * @remarks
 * Only the provided fields are changed. Null values
 * explicitly clear optional fields.
 *
 * @explanation
 * Use this DTO to update fund metadata through the
 * service layer.
 *
 * @example
 * const DTO: UpdateFundDTO = {
 *   name: "Fundo Master Plus",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdateFundDTO {
  name?: string
  administrationFee?: string | null
  performanceFee?: string | null
  benchmarkId?: string | null
  categoryId?: string | null
}
