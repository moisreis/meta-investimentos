"use server"

import { NormalizeAcronym } from "@/lib/benchmark/normalize-acronym"
import { RequireSessionUser } from "@/lib/auth/require-session"
import { calculateBenchmarkMonthlyRates } from "@/domain/benchmark/calculators/benchmark-monthly-series.calculator"
import { BenchmarkContainer } from "@/presentation/composition/benchmark.container"
import { BenchmarkHistoryContainer } from "@/presentation/composition/benchmark-history.container"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { STATEMENT_REPORT_INDEX_ACRONYMS } from "@/services/statement/report/statement-report.constants"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { GENERATE_STATEMENT_SCHEMA } from "../validations/statement-actions.validation"

/**
 * Availability of the statement report of a month.
 */
export interface StatementMonthAvailability {
  // True when every reading the report needs exists.
  available: boolean
}

/**
 * @summary
 * Checks whether the statement report of a month can be
 * rendered.
 *
 * @remarks
 * The report cannot state the month meta without the IPCA
 * reading of the reference month, so opening a report whose
 * month holds no reading fails mid-render. This action runs
 * the same index resolution the report builder runs, only
 * for the reference month, so the browser can refuse to
 * open a file that would end in an error page. Resolves the
 * session first and scopes the portfolio ownership through
 * the acting user, never trusting the id on its own.
 *
 * @explanation
 * Call from the open-report flow before opening the file
 * url, so the user gets an in-app message instead of a blank
 * tab.
 *
 * @param input - The untrusted portfolio and month payload.
 *
 * @returns Whether the report of the month can be rendered.
 *
 * @example
 * const RESULT = await checkStatementMonthAction({
 *   portfolioId: "portfolio-1",
 *   month: "2026-07",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export async function checkStatementMonthAction(
  input: unknown
): Promise<ActionResult<StatementMonthAvailability>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = GENERATE_STATEMENT_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { portfolioId: PORTFOLIO_ID, month: MONTH } =
      PARSED.data

    const { list: LIST_PORTFOLIOS } = PortfolioContainer()
    const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
      userId: USER.id,
    })

    const OWNS_PORTFOLIO = PORTFOLIOS.some(
      (portfolio) => portfolio.id === PORTFOLIO_ID
    )

    if (!OWNS_PORTFOLIO) {
      return ActionFailure("Selecione uma carteira válida.")
    }

    const AVAILABLE = await ResolveIpcaAvailability(MONTH)

    return ActionSuccess({ available: AVAILABLE })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível verificar o relatório."
    )
  }
}

/**
 * Resolves whether the IPCA benchmark holds a reading for
 * the provided month, through the same index resolution the
 * report builder runs.
 */
async function ResolveIpcaAvailability(
  month: string
): Promise<boolean> {
  const TARGET = NormalizeAcronym(
    STATEMENT_REPORT_INDEX_ACRONYMS.ipca
  )

  const { list: LIST_BENCHMARKS } = BenchmarkContainer()
  const BENCHMARKS = await LIST_BENCHMARKS.execute({})

  const IPCA = BENCHMARKS.find(
    (benchmark) => NormalizeAcronym(benchmark.acronym) === TARGET
  )

  if (IPCA === undefined) return false

  const { list: LIST_BENCHMARK_HISTORY } =
    BenchmarkHistoryContainer()
  const HISTORY = await LIST_BENCHMARK_HISTORY.execute({
    benchmarkId: IPCA.id,
  })

  const [READING] = calculateBenchmarkMonthlyRates({
    entries: HISTORY.map((entry) => ({
      date: entry.date,
      rate: entry.rate,
    })),
    months: [month],
  })

  return READING?.rate !== null && READING?.rate !== undefined
}
