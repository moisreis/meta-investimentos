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
  id: string
  portfolioId: string
  date: string
  // Total quotas held by the portfolio.
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
  // Null when no target is defined.
  target: string | null
  cumulativeTarget: string | null
  inflationSpread: string | null
  riskFreeSpread: string | null
  marketSpread: string | null
  createdAt: string
}
