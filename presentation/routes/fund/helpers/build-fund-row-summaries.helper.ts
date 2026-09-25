import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { FundRowSummaryDTO } from "@/services/fund/use-cases/list-fund-row-summaries.use-case"

import type { FundRowSummary } from "../types/fund-list.types"

/**
 * @summary
 * Composes the derived data of the fund rows.
 *
 * @remarks
 * Merges the grouped position counts with the fund
 * rows, keyed by fund id. Funds without any linked
 * position fall back to a zero count.
 *
 * @explanation
 * Use this helper in loaders that need the per-row
 * summary record consumed by the datatable and the
 * KPI hooks.
 *
 * @param funds - The fund rows.
 * @param counts - The position counts from the service.
 *
 * @returns The summaries keyed by fund id.
 *
 * @example
 * const SUMMARIES = BuildFundRowSummaries(FUNDS, COUNTS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildFundRowSummaries(
  funds: FundResponseDTO[],
  counts: FundRowSummaryDTO[]
): Record<string, FundRowSummary> {
  const COUNTS_BY_FUND = new Map(
    counts.map((entry) => [entry.fundId, entry])
  )

  return Object.fromEntries(
    funds.map((fund) => [
      fund.id,
      {
        positionCount:
          COUNTS_BY_FUND.get(fund.id)?.positionCount ?? 0,
      },
    ])
  )
}
