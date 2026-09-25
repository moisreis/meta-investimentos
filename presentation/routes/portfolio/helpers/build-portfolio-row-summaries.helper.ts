import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PortfolioRowSummaryDTO } from "@/services/portfolio/use-cases/list-portfolio-row-summaries.use-case"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

import type {
  PortfolioOwner,
  PortfolioRowSummary,
} from "../types/portfolio-list.types"

/**
 * @summary
 * Composes the derived data of the portfolio rows.
 *
 * @remarks
 * Merges the grouped holdings counts with the display data
 * of the owning user, keyed by portfolio id. The owner is
 * resolved per row from the portfolio user id, so it stays
 * correct even when a list crosses user boundaries.
 *
 * @explanation
 * Use this helper in loaders that need the per-row summary
 * record consumed by the datatable and the KPI hooks.
 *
 * @param portfolios - The portfolio rows.
 * @param counts - The holdings counts from the service.
 * @param userId - The id of the signed-in user.
 * @param user - The display data of the signed-in user.
 *
 * @returns The summaries keyed by portfolio id.
 *
 * @example
 * const SUMMARIES = BuildPortfolioRowSummaries(
 *   PORTFOLIOS,
 *   COUNTS,
 *   "user-1",
 *   USER
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildPortfolioRowSummaries(
  portfolios: PortfolioResponseDTO[],
  counts: PortfolioRowSummaryDTO[],
  userId: string,
  user: UserResponseDTO
): Record<string, PortfolioRowSummary> {
  const COUNTS_BY_PORTFOLIO = new Map(
    counts.map((entry) => [entry.portfolioId, entry])
  )

  const OWNER: PortfolioOwner = {
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
  }

  return Object.fromEntries(
    portfolios.map((portfolio) => [
      portfolio.id,
      {
        fundCount:
          COUNTS_BY_PORTFOLIO.get(portfolio.id)?.fundCount ?? 0,
        bankAccountCount:
          COUNTS_BY_PORTFOLIO.get(portfolio.id)
            ?.bankAccountCount ?? 0,
        owner: portfolio.userId === userId ? OWNER : null,
      },
    ])
  )
}
