import { db } from "@/clients/database.client"
import { ApplicationRepository } from "@/infrastructure/application/repositories/application.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { NormRepository } from "@/infrastructure/norm/repositories/norm.repository"
import { NormsPortfoliosRepository } from "@/infrastructure/norms-portfolio/repositories/norms-portfolios.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { PositionPerformanceRepository } from "@/infrastructure/position-performance/repositories/position-performance.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { WithdrawalRepository } from "@/infrastructure/withdrawal/repositories/withdrawal.repository"
import { ListFundsUseCase } from "@/services/fund/use-cases/list-funds.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"
import { ListAllPositionsUseCase } from "@/services/position/use-cases/list-all-positions.use-case"
import { CalculatePositionPerformanceUseCase } from "@/services/position-performance/use-cases/calculate-position-performance.use-case"
import { ListAllPositionPerformancesUseCase } from "@/services/position-performance/use-cases/list-all-position-performances.use-case"

// The position performance use cases, already wired to the
// repositories.
interface PositionPerformanceUseCases {
  calculate: CalculatePositionPerformanceUseCase
  list: ListPortfoliosUseCase
  listAll: ListAllPositionPerformancesUseCase
  listFunds: ListFundsUseCase
  listPositions: ListAllPositionsUseCase
}

/**
 * @summary
 * Wires the position performance use cases to their
 * repositories.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot. The daily calculation use
 * case spans eight repositories, because one snapshot reads
 * the fund, its quotas, the movements, the position history
 * and the norms that define the target allocation.
 *
 * @explanation
 * Use this container from any server module that needs a
 * position performance use case.
 *
 * @returns The wired position performance use cases.
 *
 * @example
 * const { list: LIST_PORTFOLIOS } =
 *   PositionPerformanceContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function PositionPerformanceContainer(): PositionPerformanceUseCases {
  const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
  const POSITION_REPOSITORY = new PositionRepository(db)
  const FUND_REPOSITORY = new FundRepository(db)
  const QUOTA_REPOSITORY = new QuotaRepository(db)
  const APPLICATION_REPOSITORY = new ApplicationRepository(db)
  const WITHDRAWAL_REPOSITORY = new WithdrawalRepository(db)
  const POSITION_PERFORMANCE_REPOSITORY =
    new PositionPerformanceRepository(db)
  const NORM_REPOSITORY = new NormRepository(db)
  const NORMS_PORTFOLIOS_REPOSITORY =
    new NormsPortfoliosRepository(db)

  return {
    calculate: new CalculatePositionPerformanceUseCase(
      POSITION_REPOSITORY,
      FUND_REPOSITORY,
      QUOTA_REPOSITORY,
      APPLICATION_REPOSITORY,
      WITHDRAWAL_REPOSITORY,
      POSITION_PERFORMANCE_REPOSITORY,
      NORM_REPOSITORY,
      NORMS_PORTFOLIOS_REPOSITORY
    ),
    list: new ListPortfoliosUseCase(PORTFOLIO_REPOSITORY),
    listAll: new ListAllPositionPerformancesUseCase(
      POSITION_PERFORMANCE_REPOSITORY
    ),
    listFunds: new ListFundsUseCase(FUND_REPOSITORY),
    listPositions: new ListAllPositionsUseCase(
      POSITION_REPOSITORY
    ),
  }
}

export {
  PositionPerformanceContainer,
  type PositionPerformanceUseCases,
}
