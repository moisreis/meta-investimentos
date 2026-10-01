import { RequireSessionUser } from "@/lib/auth/require-session"
import { LogError } from "@/lib/log/logger"
import { FundContainer } from "@/presentation/composition/fund.container"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { PositionContainer } from "@/presentation/composition/position.container"

import type {
  FundLinkedPositionRow,
  FundOverviewData,
} from "../types/fund-overview.types"

/**
 * @summary
 * Resolves the fund detail screen data.
 *
 * @remarks
 * Resolves the session through the shared auth helper,
 * loads the fund through the container, then lists the
 * portfolios of the session user, the positions held
 * across them and the registries the fund links to. The
 * positions are narrowed to the fund and their portfolio
 * names are resolved from the user portfolios, so the
 * screen never shows a position the session user cannot
 * see. Returns null when there is no session or the fund
 * cannot be resolved.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution, the fund lookup and the registry listing
 * stay in a single composition point.
 *
 * @param fundId - The fund id to resolve.
 *
 * @returns The overview data, or `null`.
 *
 * @example
 * const DATA = await LoadFundOverview("fund-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function LoadFundOverview(
  fundId: string
): Promise<FundOverviewData | null> {
  try {
    const USER = await RequireSessionUser()

    if (!USER) return null

    const { get: GET_FUND } = FundContainer()
    const FUND = await GET_FUND.execute({ fundId })

    const { list: LIST_PORTFOLIOS } = PortfolioContainer()
    const { listAll: LIST_POSITIONS } = PositionContainer()
    const {
      listBanks: LIST_BANKS,
      listBenchmarks: LIST_BENCHMARKS,
      listCategories: LIST_CATEGORIES,
    } = FundContainer()

    const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
      userId: USER.id,
    })

    const [POSITIONS, BANKS, BENCHMARKS, CATEGORIES] =
      await Promise.all([
        LIST_POSITIONS.execute({
          portfolioIds: PORTFOLIOS.map(
            (portfolio) => portfolio.id
          ),
        }),
        LIST_BANKS.execute({}),
        LIST_BENCHMARKS.execute({}),
        LIST_CATEGORIES.execute({}),
      ])

    const BANK = BANKS.find((bank) => bank.id === FUND.bankId)
    const BENCHMARK = FUND.benchmarkId
      ? BENCHMARKS.find((entry) => entry.id === FUND.benchmarkId)
      : undefined
    const CATEGORY = FUND.categoryId
      ? CATEGORIES.find((entry) => entry.id === FUND.categoryId)
      : undefined

    const POSITION_ROWS: FundLinkedPositionRow[] =
      POSITIONS.filter(
        (position) => position.fundId === FUND.id
      ).map((position) => ({
        id: position.id,
        portfolioId: position.portfolioId,
        portfolioName:
          PORTFOLIOS.find(
            (entry) => entry.id === position.portfolioId
          )?.name ?? null,
        allocation: position.allocation,
        initialBalance: position.initialBalance,
      }))

    return {
      fundId: FUND.id,
      fundName: FUND.name,
      cnpj: FUND.cnpj,
      administrationFee: FUND.administrationFee,
      performanceFee: FUND.performanceFee,
      bankName: BANK?.name ?? null,
      benchmarkName: BENCHMARK?.name ?? null,
      categoryName: CATEGORY?.name ?? null,
      positions: POSITION_ROWS,
    }
  } catch (cause) {
    LogError(
      "LoadFundOverview",
      "failed to resolve the fund overview.",
      cause
    )
    return null
  }
}
