import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { BenchmarkResponseDTO } from "@/services/benchmark/dto/benchmark-response.dto"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

import type { FundNameLookups } from "../types/fund-list.types"

// Empty lookups used before the loader resolves.
export const EMPTY_FUND_NAME_LOOKUPS: FundNameLookups = {
  banks: {},
  benchmarks: {},
  categories: {},
}

/**
 * @summary
 * Builds the name lookups of the fund datatable.
 *
 * @remarks
 * Maps each registry id to its display name so the
 * datatable can resolve the bank, benchmark, and
 * category columns without joining tables.
 *
 * @explanation
 * Use this helper in loaders that need the name
 * records consumed by the fund datatable columns.
 *
 * @param banks - The registered banks.
 * @param benchmarks - The registered benchmarks.
 * @param categories - The registered categories.
 *
 * @returns The name lookups.
 *
 * @example
 * const NAMES = BuildFundNameLookups(
 *   BANKS, BENCHMARKS, CATEGORIES);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildFundNameLookups(
  banks: BankResponseDTO[],
  benchmarks: BenchmarkResponseDTO[],
  categories: CategoryResponseDTO[]
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
    categories: Object.fromEntries(
      categories.map((category) => [category.id, category.name])
    ),
  }
}
