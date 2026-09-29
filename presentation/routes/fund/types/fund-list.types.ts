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

// Derived data rendered on a fund row.
export interface FundRowSummary {
  // Positions linked to the fund.
  positionCount: number
}

// Name lookups used by the fund datatable.
export interface FundNameLookups {
  banks: Record<string, string>
  benchmarks: Record<string, string>
  categories: Record<string, string>
}
