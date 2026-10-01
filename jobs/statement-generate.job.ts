import "dotenv/config"

import { ApplicationContainer } from "@/presentation/composition/application.container"
import { BankContainer } from "@/presentation/composition/bank.container"
import { FundContainer } from "@/presentation/composition/fund.container"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { PositionContainer } from "@/presentation/composition/position.container"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"
import { BuildPortfolioHoldings } from "@/presentation/mappers/portfolio-holding.mapper"
import { RenderStatementPdf } from "@/presentation/parts/statement-report/shared-statement-report-pdf.helper"
import { FilterPortfolioActivity } from "@/presentation/routes/portfolio/helpers/filter-portfolio-activity.helper"
import { BuildPortfolioActivityRows } from "@/presentation/routes/portfolio/helpers/build-portfolio-activity-rows.helper"
import { BuildStatementPeriod } from "@/presentation/routes/statement/helpers/build-statement-period.helper"
import { ResolvePeriodWindow } from "@/lib/performance/period-window.calculator"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import { BuildStatementReportData } from "@/services/statement/report/statement-report.data"

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
 * through the shared holding mapper) and the monthly
 * activity rows of the extrato (reversals dropped and the
 * month window applied through the shared helpers), plus the
 * performance window and chained month return of the shared
 * period calculators. The report mapper only projects those
 * shared figures, so the PDF never sums, filters or queries
 * data by itself. Returns `null` when the portfolio is not
 * found or not owned by the acting user.
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

  const HOLDINGS = BuildPortfolioHoldings(WEIGHTS, FUNDS, BANKS)
  const POSITION_IDS = HOLDINGS.map(
    (holding) => holding.positionId
  )

  const { listAllApplications: LIST_APPLICATIONS } =
    ApplicationContainer()
  const { listAllWithdrawals: LIST_WITHDRAWALS } =
    WithdrawalContainer()
  const {
    listPerformances: LIST_PERFORMANCES,
    resolvePeriodReturns: RESOLVE_PERIOD_RETURNS,
  } = PortfolioContainer()

  const [APPLICATIONS, WITHDRAWALS, PERFORMANCES, RETURNS] =
    await Promise.all([
      LIST_APPLICATIONS.execute({ positionIds: POSITION_IDS }),
      LIST_WITHDRAWALS.execute({ positionIds: POSITION_IDS }),
      LIST_PERFORMANCES.execute({
        portfolioId: input.portfolioId,
      }),
      RESOLVE_PERIOD_RETURNS.execute({
        portfolioId: input.portfolioId,
        userId: input.userId,
        from: FROM,
        to: TO,
      }),
    ])

  const MONTHLY = FilterPortfolioActivity(
    BuildPortfolioActivityRows(
      HOLDINGS,
      APPLICATIONS,
      WITHDRAWALS
    ),
    { from: FROM, to: TO }
  )

  const DATA = BuildStatementReportData({
    portfolio: PORTFOLIO,
    month: input.month,
    periodStart: PERIOD.periodStart,
    periodEnd: PERIOD.periodEnd,
    holdings: HOLDINGS,
    movements: MONTHLY,
    window: ResolvePeriodWindow(PERFORMANCES, FROM, TO),
    monthReturn: RETURNS.monthReturn,
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
