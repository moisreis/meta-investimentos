import { db } from "@/clients/database.client"
import { NormsPortfoliosRepository } from "@/infrastructure/norms-portfolio/repositories/norms-portfolios.repository"
import { ListPortfolioNormsUseCase } from "@/services/norms-portfolio/use-cases/list-portfolio-norms.use-case"

// The norms-portfolios use cases a screen may read, already
// wired to the repository. The writes belong to the portfolio
// use cases, which own the relations of the aggregate they
// change, so they are not offered here.
interface NormsPortfoliosUseCases {
  listByPortfolio: ListPortfolioNormsUseCase
}

/**
 * @summary
 * Wires the norms-portfolios read use cases to the repository.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * @explanation
 * Use this container from any server module that needs to
 * read the norms of a portfolio.
 *
 * @returns The wired norms-portfolios use cases.
 *
 * @example
 * const { listByPortfolio: LIST } = NormsPortfoliosContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
function NormsPortfoliosContainer(): NormsPortfoliosUseCases {
  const REPOSITORY = new NormsPortfoliosRepository(db)

  return {
    listByPortfolio: new ListPortfolioNormsUseCase(REPOSITORY),
  }
}

export { NormsPortfoliosContainer, type NormsPortfoliosUseCases }
