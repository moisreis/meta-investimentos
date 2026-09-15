import type {
  EntityId,
  QuotaQuantity,
  PositiveMoney,
  SignedMoney,
  SignedPercentage,
} from "@/value-objects"

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
  id: EntityId
  positionId: EntityId
  date: Date
  // Total quotas held by the position.
  quotasHeld: QuotaQuantity
  patrimony: PositiveMoney
  applicationTotal: PositiveMoney
  redemptionTotal: PositiveMoney
  cashFlowNet: SignedMoney
  earnings: SignedMoney
  returnDaily: SignedPercentage
  // Nullable returns at longer horizons.
  returnMonthly: SignedPercentage | null
  returnYearly: SignedPercentage | null
  returnLast12m: SignedPercentage | null
  // Portfolio weight of the position.
  allocation: SignedPercentage
  createdAt: Date
}
