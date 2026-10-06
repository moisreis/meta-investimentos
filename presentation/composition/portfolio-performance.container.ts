import { db } from "@/clients/database.client"
import { ApplicationRepository } from "@/infrastructure/application/repositories/application.repository"
import { BenchmarkHistoryRepository } from "@/infrastructure/benchmark-history/repositories/benchmark-history.repository"
import { BenchmarkRepository } from "@/infrastructure/benchmark/repositories/benchmark.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { NormRepository } from "@/infrastructure/norm/repositories/norm.repository"
import { NormsPortfoliosRepository } from "@/infrastructure/norms-portfolio/repositories/norms-portfolios.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { PositionPerformanceRepository } from "@/infrastructure/position-performance/repositories/position-performance.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { WithdrawalRepository } from "@/infrastructure/withdrawal/repositories/withdrawal.repository"
import { CalculatePortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/calculate-portfolio-performance.use-case"
import { DeletePortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/delete-portfolio-performance.use-case"
import { ListAllPortfolioPerformancesUseCase } from "@/services/portfolio-performance/use-cases/list-all-portfolio-performances.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"
import { CalculatePositionPerformanceUseCase } from "@/services/position-performance/use-cases/calculate-position-performance.use-case"

// The portfolio performance use cases, already wired to
// the repositories.
interface PortfolioPerformanceUseCases {
  calculate: CalculatePortfolioPerformanceUseCase
  delete: DeletePortfolioPerformanceUseCase
  list: ListPortfoliosUseCase
  listAll: ListAllPortfolioPerformancesUseCase
}

/**
 * @summary
 * Wires the portfolio performance use cases to their
 * repositories.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot. The daily calculation use
 * case spans several repositories, because one snapshot
 * reads positions, quotas, movements and both performance
 * histories. It also takes the position performance use
 * case, so each position is valued for the day before the
 * portfolio aggregates it. The benchmark pair comes from
 * here too, because the target reads the inflation index
 * off the benchmark series rather than off a caller.
 *
 * @explanation
 * Use this container from any server module that needs a
 * portfolio performance use case.
 *
 * @returns The wired portfolio performance use cases.
 *
 * @example
 * const { listAll: LIST_PERFORMANCES } =
 *   PortfolioPerformanceContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function PortfolioPerformanceContainer(): PortfolioPerformanceUseCases {
  const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
  const POSITION_REPOSITORY = new PositionRepository(db)
  const QUOTA_REPOSITORY = new QuotaRepository(db)
  const APPLICATION_REPOSITORY = new ApplicationRepository(db)
  const WITHDRAWAL_REPOSITORY = new WithdrawalRepository(db)
  const POSITION_PERFORMANCE_REPOSITORY =
    new PositionPerformanceRepository(db)
  const PORTFOLIO_PERFORMANCE_REPOSITORY =
    new PortfolioPerformanceRepository(db)
  const POSITION_PERFORMANCE_CALCULATE_USE_CASE =
    new CalculatePositionPerformanceUseCase(
      POSITION_REPOSITORY,
      new FundRepository(db),
      QUOTA_REPOSITORY,
      APPLICATION_REPOSITORY,
      WITHDRAWAL_REPOSITORY,
      POSITION_PERFORMANCE_REPOSITORY,
      new NormRepository(db),
      new NormsPortfoliosRepository(db)
    )

  return {
    calculate: new CalculatePortfolioPerformanceUseCase(
      PORTFOLIO_REPOSITORY,
      POSITION_REPOSITORY,
      QUOTA_REPOSITORY,
      APPLICATION_REPOSITORY,
      WITHDRAWAL_REPOSITORY,
      POSITION_PERFORMANCE_REPOSITORY,
      PORTFOLIO_PERFORMANCE_REPOSITORY,
      POSITION_PERFORMANCE_CALCULATE_USE_CASE,
      // The target reads the inflation index from these
      // two, so the calculation no longer depends on a
      // caller remembering to pass one.
      new BenchmarkRepository(db),
      new BenchmarkHistoryRepository(db)
    ),
    delete: new DeletePortfolioPerformanceUseCase(
      PORTFOLIO_PERFORMANCE_REPOSITORY
    ),
    list: new ListPortfoliosUseCase(PORTFOLIO_REPOSITORY),
    listAll: new ListAllPortfolioPerformancesUseCase(
      PORTFOLIO_PERFORMANCE_REPOSITORY
    ),
  }
}

export {
  PortfolioPerformanceContainer,
  type PortfolioPerformanceUseCases,
}
