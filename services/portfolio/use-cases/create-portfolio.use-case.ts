import { Portfolio } from "@domain/portfolio/entities/portfolio.entity"
import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { INormsPortfolios } from "@domain/norms-portfolio/interfaces/norms-portfolios.interface"
import { NormsPortfolios } from "@domain/norms-portfolio/entities/norms-portfolios.entity"
import { toCreateNormsPortfoliosProps } from "@/services/norms-portfolio/mappers/norms-portfolio.mapper"
import { EntityId } from "@/value-objects"
import type { PortfolioNormAllocationDTO } from "../dto/portfolio-norm-allocation.dto"
import type { PortfolioResponseDTO } from "../dto/portfolio-response.dto"
import {
  toCreatePortfolioProps,
  toResponseDTO,
} from "../mappers/portfolio.mapper"

export interface CreatePortfolioInput {
  acronym: string
  name: string
  userId: string
  annualInterestRate: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
  norms?: PortfolioNormAllocationDTO[]
}

/**
 * @summary
 * Creates a new `Portfolio` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the portfolio with the portfolio repository.
 * The requested norms are then attached to the saved
 * portfolio as norm-portfolio relations, each carrying its
 * own minimum, target and maximum allocation.
 *
 * @explanation
 * Use this use case to register a new portfolio through
 * the service layer.
 *
 * @example
 * const PORTFOLIO = await CREATE_PORTFOLIO_USE_CASE.execute({
 *   acronym: "ME",
 *   name: "Meu Portfolio",
 *   userId: "user-1",
 *   annualInterestRate: "12.0",
 *   minAllocation: "5",
 *   maxAllocation: "20",
 *   targetAllocation: "12",
 *   norms: [
 *     {
 *       normId: "norm-1",
 *       minAllocation: "5",
 *       targetAllocation: "10",
 *       maxAllocation: "15",
 *     },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreatePortfolioUseCase {
  constructor(
    private portfolioRepository: IPortfolio,
    private normsPortfoliosRepository: INormsPortfolios
  ) {}

  /**
   * @summary
   * Creates and persists a new portfolio.
   *
   * @remarks
   * Builds entity props through the create mapper and
   * saves the portfolio with the portfolio repository.
   * The requested norms are then attached to the saved
   * portfolio as norm-portfolio relations, each carrying
   * its own minimum, target and maximum allocation.
   *
   * @explanation
   * Use this method to register a new portfolio through
   * the service layer.
   *
   * @param input - The portfolio creation payload.
   *
   * @returns The persisted portfolio.
   *
   * @example
   * const PORTFOLIO = await CREATE_PORTFOLIO_USE_CASE.execute({
   *   acronym: "ME",
   *   name: "Meu Portfolio",
   *   userId: "user-1",
   *   annualInterestRate: "12.0",
   *   minAllocation: "5",
   *   maxAllocation: "20",
   *   targetAllocation: "12",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: CreatePortfolioInput
  ): Promise<PortfolioResponseDTO> {
    const PROPS = toCreatePortfolioProps(input)
    const PORTFOLIO = Portfolio.create(PROPS)
    const SAVED = await this.portfolioRepository.save(PORTFOLIO)
    const PORTFOLIO_ID = SAVED.id

    if (PORTFOLIO_ID) {
      await this.CreateNormRelations(input.norms, PORTFOLIO_ID)
    }

    return toResponseDTO(SAVED)
  }

  /**
   * @summary
   * Attaches the requested norms to the saved portfolio.
   *
   * @remarks
   * A relation that already exists is left untouched, so a
   * retried create never overwrites the allocation the user
   * typed. A range the entity rejects aborts the call,
   * rather than leaving the portfolio with some of the
   * requested norms and without the others.
   *
   * @explanation
   * Use this method from `execute` once the portfolio row
   * exists, because a relation is keyed on its portfolio id.
   *
   * @param norms - The norms of the payload, when any.
   * @param portfolioId - Id of the saved portfolio.
   *
   * @returns A promise resolved once every relation is saved.
   *
   * @example
   * await this.CreateNormRelations(NORMS, PORTFOLIO_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-10-04
   */
  private async CreateNormRelations(
    norms: PortfolioNormAllocationDTO[] | undefined,
    portfolioId: EntityId
  ): Promise<void> {
    for (const norm of norms ?? []) {
      const EXISTING =
        await this.normsPortfoliosRepository.findByNormIdAndPortfolioId(
          EntityId.create(norm.normId),
          portfolioId
        )

      if (EXISTING) continue

      const RELATION = NormsPortfolios.create(
        toCreateNormsPortfoliosProps({
          normId: norm.normId,
          portfolioId,
          minAllocation: norm.minAllocation,
          targetAllocation: norm.targetAllocation,
          maxAllocation: norm.maxAllocation,
        })
      )

      await this.normsPortfoliosRepository.save(RELATION)
    }
  }
}
