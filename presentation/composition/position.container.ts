import { db } from "@/clients/database.client"
import { ApplicationRepository } from "@/infrastructure/application/repositories/application.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { WithdrawalRepository } from "@/infrastructure/withdrawal/repositories/withdrawal.repository"
import { ListFundsUseCase } from "@/services/fund/use-cases/list-funds.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"
import { ListAllPositionsUseCase } from "@/services/position/use-cases/list-all-positions.use-case"
import { ListPositionWeightsUseCase } from "@/services/position/use-cases/list-position-weights.use-case"
import { DeletePositionUseCase } from "@/services/position/use-cases/delete-position.use-case"

// The position use cases, already wired to the repository.
interface PositionUseCases {
  list: ListPortfoliosUseCase
  listAll: ListAllPositionsUseCase
  listFunds: ListFundsUseCase
  listWeights: ListPositionWeightsUseCase
  delete: DeletePositionUseCase
}

/**
 * @summary
 * Wires the position use cases to their repositories.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * The weight use case spans three repositories, because the
 * money invested in a position is the balance it opened
 * with plus the applications and withdrawals it received.
 *
 * @explanation
 * Use this container from any server module that needs a
 * position use case.
 *
 * @returns The wired position use cases.
 *
 * @example
 * const { listFunds: LIST_FUNDS } = PositionContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function PositionContainer(): PositionUseCases {
  const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
  const POSITION_REPOSITORY = new PositionRepository(db)
  const FUND_REPOSITORY = new FundRepository(db)
  const APPLICATION_REPOSITORY = new ApplicationRepository(db)
  const WITHDRAWAL_REPOSITORY = new WithdrawalRepository(db)

  return {
    list: new ListPortfoliosUseCase(PORTFOLIO_REPOSITORY),
    listAll: new ListAllPositionsUseCase(POSITION_REPOSITORY),
    listFunds: new ListFundsUseCase(FUND_REPOSITORY),
    listWeights: new ListPositionWeightsUseCase(
      POSITION_REPOSITORY,
      APPLICATION_REPOSITORY,
      WITHDRAWAL_REPOSITORY
    ),
    delete: new DeletePositionUseCase(POSITION_REPOSITORY),
  }
}

export { PositionContainer, type PositionUseCases }
