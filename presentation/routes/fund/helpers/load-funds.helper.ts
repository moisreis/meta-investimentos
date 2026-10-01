import { RequireSessionUser } from "@/lib/auth/require-session"
import { FundContainer } from "@/presentation/composition/fund.container"
import { ToFundRows } from "@/presentation/mappers/fund-row.mapper"
import { ToBankRows } from "@/presentation/mappers/bank-row.mapper"
import { ToBenchmarkRows } from "@/presentation/mappers/benchmark-row.mapper"
import { ToCategoryRows } from "@/presentation/mappers/category-row.mapper"
import type { FundRow } from "@/presentation/types/fund-row.types"
import type { BankRow } from "@/presentation/types/bank-row.types"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"
import type { CategoryRow } from "@/presentation/types/category-row.types"

// Data resolved by the fund list loader.
export interface LoadedFundList {
  funds: FundRow[]
  banks: BankRow[]
  benchmarks: BenchmarkRow[]
  categories: CategoryRow[]
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
    funds: ToFundRows(FUNDS),
    banks: ToBankRows(BANKS),
    benchmarks: ToBenchmarkRows(BENCHMARKS),
    categories: ToCategoryRows(CATEGORIES),
  }
}
