import type { EntityId, SignedPercentage } from "@/value-objects"

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
  administrationFee?: SignedPercentage | null
  performanceFee?: SignedPercentage | null
  benchmarkId?: EntityId | null
  categoryId?: EntityId | null
}
