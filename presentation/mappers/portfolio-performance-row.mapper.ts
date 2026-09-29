import type { PortfolioPerformanceRow } from "@/presentation/types/portfolio-performance-row.types"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

/**
 * @summary
 * Projects a portfolio performance read model onto the portfolio performance row.
 *
 * @remarks
 * Keeps the 8 fields the screens render
 * and drops 11 that stay in the
 * service layer:
 * `applicationTotal`, `redemptionTotal`, `cashFlowNet`,
 *   `returnYearly`, `returnLast12m`, `target`,
 *   `cumulativeTarget`, `inflationSpread`, `riskFreeSpread`,
 *   `marketSpread`, `createdAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The portfolio performance read model.
 *
 * @returns The portfolio performance row.
 *
 * @example
 * const ROW = ToPortfolioPerformanceRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToPortfolioPerformanceRow(
  dto: PortfolioPerformanceResponseDTO
): PortfolioPerformanceRow {
  return {
    id: dto.id,
    portfolioId: dto.portfolioId,
    date: dto.date,
    quotasHeld: dto.quotasHeld,
    patrimony: dto.patrimony,
    earnings: dto.earnings,
    returnDaily: dto.returnDaily,
    returnMonthly: dto.returnMonthly,
  }
}

/**
 * @summary
 * Projects the portfolio performance read models onto the portfolio performance rows.
 *
 * @remarks
 * Keeps the 8 fields the screens render
 * and drops 11 that stay in the
 * service layer:
 * `applicationTotal`, `redemptionTotal`, `cashFlowNet`,
 *   `returnYearly`, `returnLast12m`, `target`,
 *   `cumulativeTarget`, `inflationSpread`, `riskFreeSpread`,
 *   `marketSpread`, `createdAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The portfolio performance read models.
 *
 * @returns The portfolio performance rows.
 *
 * @example
 * const ROWS = ToPortfolioPerformanceRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToPortfolioPerformanceRows(
  dtos: PortfolioPerformanceResponseDTO[]
): PortfolioPerformanceRow[] {
  return dtos.map(ToPortfolioPerformanceRow)
}
