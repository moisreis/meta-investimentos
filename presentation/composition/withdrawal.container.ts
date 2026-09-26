import { db } from "@/clients/database.client"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { WithdrawalRepository } from "@/infrastructure/withdrawal/repositories/withdrawal.repository"
import { ListFundsUseCase } from "@/services/fund/use-cases/list-funds.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"
import { ListAllPositionsUseCase } from "@/services/position/use-cases/list-all-positions.use-case"
import { AddWithdrawalUseCase } from "@/services/withdrawal/use-cases/add-withdrawal.use-case"
import { CreateWithdrawalUseCase } from "@/services/withdrawal/use-cases/create-withdrawal.use-case"
import { ListAllWithdrawalsUseCase } from "@/services/withdrawal/use-cases/list-all-withdrawals.use-case"

// The withdrawal use cases, already wired to the
// repositories.
interface WithdrawalUseCases {
  add: AddWithdrawalUseCase
  listAllPositions: ListAllPositionsUseCase
  listAllWithdrawals: ListAllWithdrawalsUseCase
  listFunds: ListFundsUseCase
  listPortfolios: ListPortfoliosUseCase
}

/**
 * @summary
 * Wires the withdrawal use cases to the repositories.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * The add use case is money-moving: it owns the quota
 * lookup, so the number of quotas is derived from the quota
 * price of the chosen date and never comes from the client.
 * Its nested create use case is wired here as well.
 *
 * @explanation
 * Use this container from any server module that needs a
 * withdrawal use case.
 *
 * @returns The wired withdrawal use cases.
 *
 * @example
 * const { add: ADD_WITHDRAWAL } = WithdrawalContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function WithdrawalContainer(): WithdrawalUseCases {
  const FUND_REPOSITORY = new FundRepository(db)
  const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
  const POSITION_REPOSITORY = new PositionRepository(db)
  const QUOTA_REPOSITORY = new QuotaRepository(db)
  const WITHDRAWAL_REPOSITORY = new WithdrawalRepository(db)

  return {
    add: new AddWithdrawalUseCase(
      POSITION_REPOSITORY,
      QUOTA_REPOSITORY,
      new CreateWithdrawalUseCase(
        WITHDRAWAL_REPOSITORY,
        POSITION_REPOSITORY
      )
    ),
    listAllPositions: new ListAllPositionsUseCase(
      POSITION_REPOSITORY
    ),
    listAllWithdrawals: new ListAllWithdrawalsUseCase(
      WITHDRAWAL_REPOSITORY
    ),
    listFunds: new ListFundsUseCase(FUND_REPOSITORY),
    listPortfolios: new ListPortfoliosUseCase(
      PORTFOLIO_REPOSITORY
    ),
  }
}

export { WithdrawalContainer, type WithdrawalUseCases }
