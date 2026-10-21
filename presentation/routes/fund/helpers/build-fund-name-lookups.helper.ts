import type { BankRow } from "@/presentation/types/bank-row.types"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"
import type { CategoryRow } from "@/presentation/types/category-row.types"
import type { NormRow } from "@/presentation/types/norm-row.types"

import type { FundNameLookups } from "../types/fund-list.types"

// Empty lookups used before the loader resolves.
export const EMPTY_FUND_NAME_LOOKUPS: FundNameLookups = {
  banks: {},
  benchmarks: {},
  norms: {},
  categories: {},
}

/**
 * @summary
 * Builds the name lookups of the fund datatable.
 *
 * @remarks
 * Maps each registry id to its display name so the
 * datatable can resolve the bank, benchmark, norm, and
 * category columns without joining tables.
 *
 * @explanation
 * Use this helper in loaders that need the name
 * records consumed by the fund datatable columns.
 *
 * @param banks - The registered banks.
 * @param benchmarks - The registered benchmarks.
 * @param norms - The registered norms.
 * @param categories - The registered categories.
 *
 * @returns The name lookups.
 *
 * @example
 * const NAMES = BuildFundNameLookups(
 *   BANKS, BENCHMARKS, NORMS, CATEGORIES);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildFundNameLookups(
  banks: BankRow[],
  benchmarks: BenchmarkRow[],
  norms: NormRow[],
  categories: CategoryRow[]
): FundNameLookups {
  return {
    banks: Object.fromEntries(
      banks.map((bank) => [bank.id, bank.name])
    ),
    benchmarks: Object.fromEntries(
      benchmarks.map((benchmark) => [
        benchmark.id,
        benchmark.name,
      ])
    ),
    norms: Object.fromEntries(
      norms.map((norm) => [norm.id, norm.name])
    ),
    categories: Object.fromEntries(
      categories.map((category) => [category.id, category.name])
    ),
  }
}
