import { LoadFunds } from "../helpers/load-funds.helper"
import { BuildFundNameLookups } from "../helpers/build-fund-name-lookups.helper"
import { BuildFundRowSummaries } from "../helpers/build-fund-row-summaries.helper"
import type { FundListProps } from "../pages/list"
import type { FundRow } from "@/presentation/types/fund-row.types"
import type { FundRowSummary } from "../types/fund-list.types"
import type { FundNameLookups } from "../types/fund-list.types"
import type { FundSelectOptions } from "../types/fund-list.types"
import type { BankRow } from "@/presentation/types/bank-row.types"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"
import type { CategoryRow } from "@/presentation/types/category-row.types"
import { FundContainer } from "@/presentation/composition/fund.container"

/**
 * @summary
 * Resolves the props for the fund list page.
 *
 * @remarks
 * Loads the session funds and their registry lookups.
 *
 * @returns The fund list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadFundPageProps();
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export async function LoadFundPageProps(): Promise<FundListProps> {
  let data: FundRow[] | null = null
  let options: FundSelectOptions | null = null
  let summaries: Record<string, FundRowSummary> | null = null
  let names: FundNameLookups = { banks: {}, benchmarks: {}, categories: {} }

  const LOADED = await LoadFunds()

  if (LOADED) {
    const FUNDS = LOADED.funds
    const OPTIONS = { banks: LOADED.banks, benchmarks: LOADED.benchmarks, categories: LOADED.categories }
    const NAMES = BuildFundNameLookups(LOADED.banks, LOADED.benchmarks, LOADED.categories)

    const { listRowSummaries: LIST_ROW_SUMMARIES } = FundContainer()
    const ROW_SUMMARIES = await LIST_ROW_SUMMARIES.execute({ fundIds: FUNDS.map((fund) => fund.id) })
    const SUMMARIES = BuildFundRowSummaries(FUNDS, ROW_SUMMARIES)

    return { data: FUNDS, options: OPTIONS, names: NAMES, summaries: SUMMARIES }
  }

  return { data: null, options: null, names: { banks: {}, benchmarks: {}, categories: {} }, summaries: null }
}