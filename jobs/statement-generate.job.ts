import "dotenv/config"

import { BankAccountContainer } from "@/presentation/composition/bank-account.container"
import { BankContainer } from "@/presentation/composition/bank.container"
import { BenchmarkContainer } from "@/presentation/composition/benchmark.container"
import { BenchmarkHistoryContainer } from "@/presentation/composition/benchmark-history.container"
import { CategoryContainer } from "@/presentation/composition/category.container"
import { CheckingAccountContainer } from "@/presentation/composition/checking-account.container"
import { FundContainer } from "@/presentation/composition/fund.container"
import { NormContainer } from "@/presentation/composition/norm.container"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { PositionContainer } from "@/presentation/composition/position.container"
import { BuildPortfolioHoldings } from "@/presentation/mappers/portfolio-holding.mapper"
import { RenderStatementPdf } from "@/presentation/parts/statement-report/shared-statement-report-pdf.helper"
import { BuildStatementPeriod } from "@/presentation/routes/statement/helpers/build-statement-period.helper"
import { ResolvePeriodWindow } from "@/lib/performance/period-window.calculator"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import {
  BuildStatementReportData,
  type StatementReportCheckingAccountSource,
} from "@/services/statement/report/statement-report.data"

/**
 * The inputs of the statement generate job.
 */
export interface StatementPdfGenerateInput {
  userId: string
  portfolioId: string
  month: string
}

/**
 * @summary
 * Runs the statement PDF generate pipeline.
 *
 * @remarks
 * Resolves and owns the target portfolio, then composes the
 * report from the same sources the detail screens resolve:
 * the holdings of the portfolio overview (weights resolved
 * through the shared holding mapper), the performance window
 * and chained month return of the shared period calculators
 * and the registries that name the report rows: funds and
 * categories, the norms of their categories, the position
 * performance snapshots and the benchmarks with their
 * readings. The report mapper only projects those shared
 * figures, so the PDF never sums, filters or queries data by
 * itself. Returns `null` when the portfolio is not found or
 * not owned by the acting user.
 *
 * @explanation
 * Use this composition root as the **Inngest** worker entry
 * for statement generation, or call it directly from a route
 * handler when the file is produced on demand.
 *
 * @param input - The target portfolio and month.
 *
 * @returns The PDF bytes, or `null` when not owned.
 *
 * @example
 * const BYTES = await runStatementPdfGenerate({
 *   userId: "user-1",
 *   portfolioId: "portfolio-1",
 *   month: "2026-01",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function runStatementPdfGenerate(
  input: StatementPdfGenerateInput
): Promise<Uint8Array<ArrayBuffer> | null> {
  const PORTFOLIO = await ResolveOwnedPortfolio(input)
  if (PORTFOLIO === null) return null

  const PERIOD = BuildStatementPeriod(input.month)
  const FROM = new Date(PERIOD.periodStart)
  const TO = new Date(PERIOD.periodEnd)

  const { listWeights: LIST_WEIGHTS } = PositionContainer()
  const { list: LIST_FUNDS } = FundContainer()
  const { list: LIST_BANKS } = BankContainer()

  const [WEIGHTS, FUNDS, BANKS] = await Promise.all([
    LIST_WEIGHTS.execute({ portfolioIds: [input.portfolioId] }),
    LIST_FUNDS.execute({}),
    LIST_BANKS.execute({}),
  ])

  // The statement describes money and custodians, so the
  // holding rows only carry the index id of each fund; the
  // registries that name the extra report rows (categories,
  // norms, benchmarks) are loaded below and joined by the
  // report mapper.
  const HOLDINGS = BuildPortfolioHoldings(
    WEIGHTS,
    FUNDS,
    BANKS,
    []
  )
  const POSITION_IDS = HOLDINGS.map(
    (holding) => holding.positionId
  )

  const { list: LIST_CATEGORIES } = CategoryContainer()
  const { list: LIST_NORMS } = NormContainer()
  const { list: LIST_BENCHMARKS } = BenchmarkContainer()
  const { list: LIST_BENCHMARK_HISTORY } =
    BenchmarkHistoryContainer()
  const { listPerformances: LIST_POSITION_PERFORMANCES } =
    PositionContainer()

  const FUND_BY_ID = new Map(
    FUNDS.map((fund) => [fund.id, fund])
  )
  const CATEGORY_IDS = [
    ...new Set(
      HOLDINGS.map(
        (holding) => FUND_BY_ID.get(holding.fundId)?.categoryId
      ).filter(
        (id): id is string => id !== null && id !== undefined
      )
    ),
  ]

  const [CATEGORIES, NORMS, BENCHMARKS] = await Promise.all([
    LIST_CATEGORIES.execute({}),
    Promise.all(
      CATEGORY_IDS.map((categoryId) =>
        LIST_NORMS.execute({ categoryId })
      )
    ).then((byCategory) => byCategory.flat()),
    LIST_BENCHMARKS.execute({}),
  ])
  const POSITION_PERFORMANCES = (
    await Promise.all(
      POSITION_IDS.map((positionId) =>
        LIST_POSITION_PERFORMANCES.execute({ positionId })
      )
    )
  ).flat()
  const BENCHMARK_HISTORIES = await Promise.all(
    BENCHMARKS.map((benchmark) =>
      LIST_BENCHMARK_HISTORY.execute({
        benchmarkId: benchmark.id,
      })
    )
  )
  const BENCHMARK_SOURCES = BENCHMARKS.map(
    (benchmark, index) => ({
      id: benchmark.id,
      acronym: benchmark.acronym,
      name: benchmark.name,
      history: BENCHMARK_HISTORIES[index].map((entry) => ({
        date: entry.date,
        rate: entry.rate,
      })),
    })
  )

  const { list: LIST_BANK_ACCOUNTS } = BankAccountContainer()
  const { list: LIST_CHECKING_ACCOUNTS } =
    CheckingAccountContainer()
  const {
    listPerformances: LIST_PERFORMANCES,
    resolvePeriodReturns: RESOLVE_PERIOD_RETURNS,
  } = PortfolioContainer()

  const [
    PERFORMANCES,
    RETURNS,
    BANK_ACCOUNTS,
    CHECKING_ENTRIES,
  ] = await Promise.all([
    LIST_PERFORMANCES.execute({
      portfolioId: input.portfolioId,
    }),
    RESOLVE_PERIOD_RETURNS.execute({
      portfolioId: input.portfolioId,
      userId: input.userId,
      from: FROM,
      to: TO,
    }),
    LIST_BANK_ACCOUNTS.execute({}),
    LIST_CHECKING_ACCOUNTS.execute({}),
  ])

  const BANK_BY_ID = new Map(
    BANKS.map((bank) => [bank.id, bank])
  )
  const CHECKING_ACCOUNTS = BuildCheckingAccountSources(
    BANK_ACCOUNTS.filter(
      (account) => account.portfolioId === input.portfolioId
    ),
    CHECKING_ENTRIES,
    BANK_BY_ID,
    PERIOD.periodEnd
  )

  const DATA = BuildStatementReportData({
    portfolio: PORTFOLIO,
    month: input.month,
    periodStart: PERIOD.periodStart,
    periodEnd: PERIOD.periodEnd,
    holdings: HOLDINGS,
    window: ResolvePeriodWindow(PERFORMANCES, FROM, TO),
    monthReturn: RETURNS.monthReturn,
    performances: PERFORMANCES,
    funds: FUNDS,
    categories: CATEGORIES,
    norms: NORMS,
    positionPerformances: POSITION_PERFORMANCES,
    benchmarks: BENCHMARK_SOURCES,
    checkingAccounts: CHECKING_ACCOUNTS,
  })

  return RenderStatementPdf(DATA)
}

/**
 * Resolves a portfolio owned by the acting user.
 */
async function ResolveOwnedPortfolio(
  input: StatementPdfGenerateInput
): Promise<PortfolioResponseDTO | null> {
  const PORTFOLIOS = await ListOwnedPortfolios(input.userId)
  return (
    PORTFOLIOS.find(
      (portfolio) => portfolio.id === input.portfolioId
    ) ?? null
  )
}

/**
 * Lists the portfolios of a user through the container.
 */
async function ListOwnedPortfolios(
  userId: string
): Promise<PortfolioResponseDTO[]> {
  const { list: LIST_PORTFOLIOS } = PortfolioContainer()
  return LIST_PORTFOLIOS.execute({ userId })
}

/**
 * Resolves the checking account balance of each bank account
 * of the portfolio on the reference month, joined to the
 * institution name. A bank account without a balance up to
 * the month end stays out, so the table only shows accounts
 * the operator already recorded.
 */
function BuildCheckingAccountSources(
  accounts: BankAccountResponseDTO[],
  entries: CheckingAccountResponseDTO[],
  banks: Map<string, BankResponseDTO>,
  periodEnd: string
): StatementReportCheckingAccountSource[] {
  const SOURCES: StatementReportCheckingAccountSource[] = []

  for (const ACCOUNT of accounts) {
    const LATEST = entries
      .filter(
        (entry) =>
          entry.bankAccountId === ACCOUNT.id &&
          entry.date <= periodEnd
      )
      .sort((left, right) => left.date.localeCompare(right.date))
      .at(-1)

    if (LATEST === undefined) continue

    SOURCES.push({
      institution: banks.get(ACCOUNT.bankId)?.name ?? "",
      accountNumber: ACCOUNT.accountNumber,
      balance: LATEST.value,
    })
  }

  return SOURCES
}
