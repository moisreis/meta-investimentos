import { db } from "@/clients/database.client"
import { ApplicationRepository } from "@/infrastructure/application/repositories/application.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { AddApplicationUseCase } from "@/services/application/use-cases/add-application.use-case"
import { CreateApplicationUseCase } from "@/services/application/use-cases/create-application.use-case"
import { ListAllApplicationsUseCase } from "@/services/application/use-cases/list-all-applications.use-case"
import { ListFundsUseCase } from "@/services/fund/use-cases/list-funds.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"
import { CreatePositionUseCase } from "@/services/position/use-cases/create-position.use-case"
import { ListAllPositionsUseCase } from "@/services/position/use-cases/list-all-positions.use-case"
import { RedistributePositionAllocationUseCase } from "@/services/position/use-cases/redistribute-position-allocation.use-case"

// The application use cases, already wired to the
// repositories.
interface ApplicationUseCases {
  add: AddApplicationUseCase
  listAllApplications: ListAllApplicationsUseCase
  listAllPositions: ListAllPositionsUseCase
  listFunds: ListFundsUseCase
  listPortfolios: ListPortfoliosUseCase
}

/**
 * @summary
 * Wires the application use cases to the repositories.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * The add use case is money-moving: it owns the position
 * creation, the portfolio redistribution and the quota
 * lookup, so the number of quotas is derived from the quota
 * price of the chosen date and never comes from the client.
 * Its three nested use cases are wired here as well.
 *
 * @explanation
 * Use this container from any server module that needs an
 * application use case.
 *
 * @returns The wired application use cases.
 *
 * @example
 * const { add: ADD_APPLICATION } = ApplicationContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function ApplicationContainer(): ApplicationUseCases {
  const APPLICATION_REPOSITORY = new ApplicationRepository(db)
  const FUND_REPOSITORY = new FundRepository(db)
  const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
  const POSITION_REPOSITORY = new PositionRepository(db)
  const QUOTA_REPOSITORY = new QuotaRepository(db)

  return {
    add: new AddApplicationUseCase(
      POSITION_REPOSITORY,
      QUOTA_REPOSITORY,
      new CreatePositionUseCase(POSITION_REPOSITORY),
      new RedistributePositionAllocationUseCase(
        POSITION_REPOSITORY
      ),
      new CreateApplicationUseCase(
        APPLICATION_REPOSITORY,
        POSITION_REPOSITORY
      )
    ),
    listAllApplications: new ListAllApplicationsUseCase(
      APPLICATION_REPOSITORY
    ),
    listAllPositions: new ListAllPositionsUseCase(
      POSITION_REPOSITORY
    ),
    listFunds: new ListFundsUseCase(FUND_REPOSITORY),
    listPortfolios: new ListPortfoliosUseCase(
      PORTFOLIO_REPOSITORY
    ),
  }
}

export { ApplicationContainer, type ApplicationUseCases }
