import { db } from "@/clients/database.client"
import { ApplicationRepository } from "@/infrastructure/application/repositories/application.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { PositionPerformanceRepository } from "@/infrastructure/position-performance/repositories/position-performance.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { WithdrawalRepository } from "@/infrastructure/withdrawal/repositories/withdrawal.repository"
import { CalculatePortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/calculate-portfolio-performance.use-case"
import { ListAllPortfolioPerformancesUseCase } from "@/services/portfolio-performance/use-cases/list-all-portfolio-performances.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"

// The portfolio performance use cases, already wired to
// the repositories.
interface PortfolioPerformanceUseCases {
  calculate: CalculatePortfolioPerformanceUseCase
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
 * case spans seven repositories, because one snapshot reads
 * positions, quotas, movements and both performance
 * histories.
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

  return {
    calculate: new CalculatePortfolioPerformanceUseCase(
      PORTFOLIO_REPOSITORY,
      POSITION_REPOSITORY,
      QUOTA_REPOSITORY,
      APPLICATION_REPOSITORY,
      WITHDRAWAL_REPOSITORY,
      POSITION_PERFORMANCE_REPOSITORY,
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
