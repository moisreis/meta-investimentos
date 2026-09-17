/**
 * @summary
 * Represents the daily performance snapshot of a position.
 *
 * @remarks
 * This DTO is the format of the response for position
 * performance queries.
 *
 * @explanation
 * Use this DTO when exposing a position performance
 * snapshot to the consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(PERFORMANCE_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface PositionPerformanceResponseDTO {
  id: string
  positionId: string
  date: string
  // Total quotas held by the position.
  quotasHeld: string
  patrimony: string
  applicationTotal: string
  redemptionTotal: string
  cashFlowNet: string
  earnings: string
  returnDaily: string
  // Nullable returns at longer horizons.
  returnMonthly: string | null
  returnYearly: string | null
  returnLast12m: string | null
  // Portfolio weight of the position.
  allocation: string
  createdAt: string
}
