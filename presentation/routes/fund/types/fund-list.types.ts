import type { BankRow } from "@/presentation/types/bank-row.types"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"
import type { CategoryRow } from "@/presentation/types/category-row.types"

/**
 * @summary
 * Options consumed by the fund form selects.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface FundSelectOptions {
  banks: BankRow[]
  benchmarks: BenchmarkRow[]
  categories: CategoryRow[]
}

/**
 * @summary
 * Counts of one fund row, as resolved by the service.
 *
 * @remarks
 * The raw count carries the fund id, because it arrives
 * keyed by the database row rather than by the screen row.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export interface FundRowSummaryInput {
  fundId: string

  // Positions linked to the fund.
  positionCount: number
}

/**
 * @summary
 * Derived data rendered on a fund row.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface FundRowSummary {
  // Positions linked to the fund.
  positionCount: number
}

/**
 * @summary
 * Name lookups used by the fund datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface FundNameLookups {
  banks: Record<string, string>
  benchmarks: Record<string, string>
  categories: Record<string, string>
}
