import { db } from "@/clients/database.client"
import { StatementRepository } from "@/infrastructure/statement/repositories/statement.repository"
import { BulkDeleteStatementsUseCase } from "@/services/statement/use-cases/bulk-delete-statements.use-case"
import { DeleteStatementUseCase } from "@/services/statement/use-cases/delete-statement.use-case"
import { GenerateStatementUseCase } from "@/services/statement/use-cases/generate-statement.use-case"
import { ListStatementsByPortfoliosUseCase } from "@/services/statement/use-cases/list-statements-by-portfolios.use-case"
import { NormalizeAcronym } from "@/lib/benchmark/normalize-acronym"
import { BenchmarkContainer } from "@/presentation/composition/benchmark.container"
import { BenchmarkHistoryContainer } from "@/presentation/composition/benchmark-history.container"
import { STATEMENT_REPORT_INDEX_ACRONYMS } from "@/services/statement/report/statement-report.constants"
import { calculateBenchmarkMonthlyRates } from "@/domain/benchmark/calculators/benchmark-monthly-series.calculator"

// The statement use cases, already wired to the repository.
interface StatementUseCases {
  bulkDelete: BulkDeleteStatementsUseCase
  generate: GenerateStatementUseCase
  listByPortfolios: ListStatementsByPortfoliosUseCase
  remove: DeleteStatementUseCase
  resolveIpcaAvailability: (month: string) => Promise<boolean>
}

/**
 * @summary
 * Wires the statement use cases to the statement repository.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * @explanation
 * Use this container from any server module that needs a
 * statement use case. The portfolio use case used to check
 * the ownership of a target portfolio is wired by
 * `PortfolioContainer`, so the statement route never builds
 * a portfolio repository on its own.
 *
 * @returns The wired statement use cases.
 *
 * @example
 * const { generate: GENERATE_STATEMENT } = StatementContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function StatementContainer(): StatementUseCases {
  const REPOSITORY = new StatementRepository(db)

  const resolveIpcaAvailability = async (
    month: string
  ): Promise<boolean> => {
    const TARGET = NormalizeAcronym(
      STATEMENT_REPORT_INDEX_ACRONYMS.ipca
    )

    const { list: LIST_BENCHMARKS } = BenchmarkContainer()
    const BENCHMARKS = await LIST_BENCHMARKS.execute({})

    const IPCA = BENCHMARKS.find(
      (benchmark) =>
        NormalizeAcronym(benchmark.acronym) === TARGET
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

  return {
    bulkDelete: new BulkDeleteStatementsUseCase(REPOSITORY),
    generate: new GenerateStatementUseCase(REPOSITORY),
    listByPortfolios: new ListStatementsByPortfoliosUseCase(
      REPOSITORY
    ),
    remove: new DeleteStatementUseCase(REPOSITORY),
    resolveIpcaAvailability,
  }
}

export { StatementContainer, type StatementUseCases }
