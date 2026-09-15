import type {
  EntityId,
  QuotaQuantity,
  PositiveMoney,
  SignedMoney,
  SignedPercentage,
} from "@/value-objects"

/**
 * @summary
 * Represents the daily performance snapshot of a portfolio.
 *
 * @remarks
 * This DTO is the format of the response for portfolio
 * performance queries.
 *
 * @explanation
 * Use this DTO when exposing a portfolio performance
 * snapshot to the consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(PERFORMANCE_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface PortfolioPerformanceResponseDTO {
  id: EntityId
  portfolioId: EntityId
  date: Date
  // Total quotas held by the portfolio.
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
  // Null when no target is defined.
  target: SignedPercentage | null
  cumulativeTarget: SignedPercentage | null
  inflationSpread: SignedPercentage | null
  riskFreeSpread: SignedPercentage | null
  marketSpread: SignedPercentage | null
  createdAt: Date
}
