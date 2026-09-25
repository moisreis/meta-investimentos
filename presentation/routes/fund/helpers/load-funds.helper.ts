import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { BenchmarkRepository } from "@/infrastructure/benchmark/repositories/benchmark.repository"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import { ListBanksUseCase } from "@/services/bank/use-cases/list-banks.use-case"
import type { BenchmarkResponseDTO } from "@/services/benchmark/dto/benchmark-response.dto"
import { ListBenchmarksUseCase } from "@/services/benchmark/use-cases/list-benchmarks.use-case"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"
import { ListCategoriesUseCase } from "@/services/category/use-cases/list-categories.use-case"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import { ListFundsUseCase } from "@/services/fund/use-cases/list-funds.use-case"

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
 * Fetches the session from the request headers and
 * lists the funds plus the banks, benchmarks, and
 * categories used by the list and the form selects.
 * Returns null when there is no active session.
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
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  const FUND_REPOSITORY = new FundRepository(db)
  const FUNDS_USE_CASE = new ListFundsUseCase(FUND_REPOSITORY)
  const FUNDS = await FUNDS_USE_CASE.execute({})

  const BANK_REPOSITORY = new BankRepository(db)
  const BANKS_USE_CASE = new ListBanksUseCase(BANK_REPOSITORY)
  const BANKS = await BANKS_USE_CASE.execute({})

  const BENCHMARK_REPOSITORY = new BenchmarkRepository(db)
  const BENCHMARKS_USE_CASE = new ListBenchmarksUseCase(
    BENCHMARK_REPOSITORY
  )
  const BENCHMARKS = await BENCHMARKS_USE_CASE.execute({})

  const CATEGORY_REPOSITORY = new CategoryRepository(db)
  const CATEGORIES_USE_CASE = new ListCategoriesUseCase(
    CATEGORY_REPOSITORY
  )
  const CATEGORIES = await CATEGORIES_USE_CASE.execute({})

  return {
    funds: FUNDS,
    banks: BANKS,
    benchmarks: BENCHMARKS,
    categories: CATEGORIES,
  }
}
