import { db } from "@/clients/database.client"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { BulkDeletePortfoliosUseCase } from "@/services/portfolio/use-cases/bulk-delete-portfolios.use-case"
import { CreatePortfolioUseCase } from "@/services/portfolio/use-cases/create-portfolio.use-case"
import { DeletePortfolioUseCase } from "@/services/portfolio/use-cases/delete-portfolio.use-case"
import { GetPortfolioUseCase } from "@/services/portfolio/use-cases/get-portfolio.use-case"
import { ListPortfolioPerformanceByRangeUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance-by-range.use-case"
import { ListPortfolioPerformanceDatesUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance-dates.use-case"
import { ListPortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance.use-case"
import { ListPortfolioRowSummariesUseCase } from "@/services/portfolio/use-cases/list-portfolio-row-summaries.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"
import { ResolvePortfolioPeriodReturnsUseCase } from "@/services/portfolio-performance/use-cases/resolve-portfolio-period-returns.use-case"
import { UpdatePortfolioUseCase } from "@/services/portfolio/use-cases/update-portfolio.use-case"

// The portfolio use cases, already wired to the repository.
interface PortfolioUseCases {
  bulkDelete: BulkDeletePortfoliosUseCase
  create: CreatePortfolioUseCase
  get: GetPortfolioUseCase
  list: ListPortfoliosUseCase
  listPerformance: ListPortfolioPerformanceUseCase
  listPerformanceByRange: ListPortfolioPerformanceByRangeUseCase
  listPerformanceDates: ListPortfolioPerformanceDatesUseCase
  listRowSummaries: ListPortfolioRowSummariesUseCase
  remove: DeletePortfolioUseCase
  resolvePeriodReturns: ResolvePortfolioPeriodReturnsUseCase
  update: UpdatePortfolioUseCase
}

/**
 * @summary
 * Wires the portfolio use cases to their repositories.
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
 * portfolio use case.
 *
 * @returns The wired portfolio use cases.
 *
 * @example
 * const { create: CREATE_PORTFOLIO } = PortfolioContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function PortfolioContainer(): PortfolioUseCases {
  const REPOSITORY = new PortfolioRepository(db)
  const PERFORMANCE_REPOSITORY =
    new PortfolioPerformanceRepository(db)
  const POSITION_REPOSITORY = new PositionRepository(db)
  const BANK_ACCOUNT_REPOSITORY = new BankAccountRepository(db)

  return {
    bulkDelete: new BulkDeletePortfoliosUseCase(REPOSITORY),
    create: new CreatePortfolioUseCase(REPOSITORY),
    get: new GetPortfolioUseCase(REPOSITORY),
    list: new ListPortfoliosUseCase(REPOSITORY),
    listPerformance: new ListPortfolioPerformanceUseCase(
      PERFORMANCE_REPOSITORY
    ),
    listPerformanceByRange:
      new ListPortfolioPerformanceByRangeUseCase(
        PERFORMANCE_REPOSITORY
      ),
    listPerformanceDates:
      new ListPortfolioPerformanceDatesUseCase(
        PERFORMANCE_REPOSITORY
      ),
    listRowSummaries: new ListPortfolioRowSummariesUseCase(
      POSITION_REPOSITORY,
      BANK_ACCOUNT_REPOSITORY
    ),
    remove: new DeletePortfolioUseCase(REPOSITORY),
    resolvePeriodReturns:
      new ResolvePortfolioPeriodReturnsUseCase(
        REPOSITORY,
        PERFORMANCE_REPOSITORY
      ),
    update: new UpdatePortfolioUseCase(REPOSITORY),
  }
}

export { PortfolioContainer, type PortfolioUseCases }
