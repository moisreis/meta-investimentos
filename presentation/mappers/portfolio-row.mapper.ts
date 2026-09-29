import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * @summary
 * Projects a portfolio read model onto the portfolio row.
 *
 * @remarks
 * Keeps the 7 fields the screens render
 * and drops 3 that stay in the
 * service layer:
 * `userId`, `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The portfolio read model.
 *
 * @returns The portfolio row.
 *
 * @example
 * const ROW = ToPortfolioRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToPortfolioRow(
  dto: PortfolioResponseDTO
): PortfolioRow {
  return {
    id: dto.id,
    acronym: dto.acronym,
    name: dto.name,
    userId: dto.userId,
    annualInterestRate: dto.annualInterestRate,
    minAllocation: dto.minAllocation,
    maxAllocation: dto.maxAllocation,
    targetAllocation: dto.targetAllocation,
  }
}

/**
 * @summary
 * Projects the portfolio read models onto the portfolio rows.
 *
 * @remarks
 * Keeps the 7 fields the screens render
 * and drops 3 that stay in the
 * service layer:
 * `userId`, `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The portfolio read models.
 *
 * @returns The portfolio rows.
 *
 * @example
 * const ROWS = ToPortfolioRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToPortfolioRows(
  dtos: PortfolioResponseDTO[]
): PortfolioRow[] {
  return dtos.map(ToPortfolioRow)
}
