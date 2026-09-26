import { RequireSessionUser } from "@/lib/auth/require-session"
import { FundContainer } from "@/presentation/composition/fund.container"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { BenchmarkResponseDTO } from "@/services/benchmark/dto/benchmark-response.dto"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

// Data resolved by the fund list loader.
export interface LoadedFundList {
  funds: FundResponseDTO[]
  banks: BankResponseDTO[]
  benchmarks: BenchmarkResponseDTO[]
  categories: CategoryResponseDTO[]
}

/**
 * @summary
 * Resolves the session user, the registered funds,
 * and the registries linked by the fund rows.
 *
 * @remarks
 * Derives the acting user from the session and lists the
 * funds plus the banks, benchmarks, and categories used by
 * the list and the form selects, all through the fund
 * container. Returns null when there is no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the fund listing stay in a single
 * composition point.
 *
 * @returns The fund rows and the registry options,
 *          or `null`.
 *
 * @example
 * const LOADED = await LoadFunds();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadFunds(): Promise<LoadedFundList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const {
    list: LIST_FUNDS,
    listBanks: LIST_BANKS,
    listBenchmarks: LIST_BENCHMARKS,
    listCategories: LIST_CATEGORIES,
  } = FundContainer()

  const FUNDS = await LIST_FUNDS.execute({})
  const BANKS = await LIST_BANKS.execute({})
  const BENCHMARKS = await LIST_BENCHMARKS.execute({})
  const CATEGORIES = await LIST_CATEGORIES.execute({})

  return {
    funds: FUNDS,
    banks: BANKS,
    benchmarks: BENCHMARKS,
    categories: CATEGORIES,
  }
}
