import { NormsPortfolios } from "@domain/norms-portfolio/entities/norms-portfolios.entity"
import { INormsPortfolios } from "@domain/norms-portfolio/interfaces/norms-portfolios.interface"
import { ValidationError } from "@errors/validation.error"
import { NotFoundError } from "@errors/not-found.error"
import { INorm } from "@domain/norm/interfaces/norm.interface"
import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { EntityId } from "@/value-objects"
import type { NormPortfolioResponseDTO } from "../dto/norm-portfolio-response.dto"
import {
  toCreateNormsPortfoliosProps,
  toResponseDTO,
} from "../mappers/norms-portfolio.mapper"

export interface AttachNormToPortfolioInput {
  normId: string
  portfolioId: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
}

/**
 * @summary
 * Attaches a `Norm` to a `Portfolio`.
 *
 * @remarks
 * Verifies the norm and the portfolio exist, rejects
 * duplicate relations, and persists the new relation.
 *
 * @explanation
 * Use this use case to bind a norm to a portfolio with
 * allocation limits through the service layer.
 *
 * @example
 * const RELATION = await ATTACH_NORM_TO_PORTFOLIO_USE_CASE
 *   .execute({
 *     normId: "norm-1",
 *     portfolioId: "portfolio-1",
 *     minAllocation: "5",
 *     maxAllocation: "20",
 *     targetAllocation: "12",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class AttachNormToPortfolioUseCase {
  constructor(
    private normsPortfoliosRepository: INormsPortfolios,
    private normRepository: INorm,
    private portfolioRepository: IPortfolio
  ) {}

  /**
   * @summary
   * Attaches and persists the norm-portfolio relation.
   *
   * @remarks
   * Verifies the norm and the portfolio exist, rejects
   * duplicate relations, and persists the new relation.
   *
   * @explanation
   * Use this method to bind a norm to a portfolio with
   * allocation limits through the service layer.
   *
   * @param input - The relation creation payload.
   *
   * @returns The persisted relation.
   *
   * @example
   * const RELATION = await ATTACH_NORM_TO_PORTFOLIO_USE_CASE
   *   .execute({
   *     normId: "norm-1",
   *     portfolioId: "portfolio-1",
   *     minAllocation: "5",
   *     maxAllocation: "20",
   *     targetAllocation: "12",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: AttachNormToPortfolioInput
  ): Promise<NormPortfolioResponseDTO> {
    const NORM_ID = EntityId.create(input.normId)
    const PORTFOLIO_ID = EntityId.create(input.portfolioId)
    const NORM = await this.normRepository.findById(NORM_ID)
    if (!NORM) {
      throw new NotFoundError("`Norm` not found.")
    }
    const PORTFOLIO = await this.portfolioRepository.findById(PORTFOLIO_ID)
    if (!PORTFOLIO) {
      throw new NotFoundError("`Portfolio` not found.")
    }
    const EXISTING =
      await this.normsPortfoliosRepository.findByNormIdAndPortfolioId(
        NORM_ID,
        PORTFOLIO_ID
      )
    if (EXISTING) {
      throw new ValidationError(
        "`Norm` is already attached to the `Portfolio`."
      )
    }
    const PROPS = toCreateNormsPortfoliosProps(input)
    const RELATION = NormsPortfolios.create(PROPS)
    const SAVED = await this.normsPortfoliosRepository.save(RELATION)
    return toResponseDTO(SAVED)
  }
}
