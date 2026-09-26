import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { PortfolioResponseDTO } from "../dto/portfolio-response.dto"
import { toResponseDTO } from "../mappers/portfolio.mapper"

export interface UpdatePortfolioInput {
  portfolioId: string
  /** Owning user id; when provided, ownership is enforced. */
  userId?: string
  acronym?: string
  name?: string
  annualInterestRate?: string
  minAllocation?: string
  maxAllocation?: string
  targetAllocation?: string
}

/**
 * @summary
 * Updates an existing `Portfolio`.
 *
 * @remarks
 * Fetches the portfolio, applies `updateAnnualInterestRate`
 * and `updateAllocation` for the provided fields, and
 * persists the updated entity.
 *
 * @explanation
 * Use this use case to edit the editable fields of an
 * existing portfolio through the service layer.
 *
 * @example
 * const PORTFOLIO = await UPDATE_PORTFOLIO_USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 *   annualInterestRate: "10.5",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdatePortfolioUseCase {
  constructor(private portfolioRepository: IPortfolio) {}

  /**
   * @summary
   * Updates and persists a portfolio.
   *
   * @remarks
   * Fetches the portfolio, applies `updateAnnualInterestRate`
   * and `updateAllocation` for the provided fields, and
   * persists the updated entity.
   *
   * @explanation
   * Use this method to edit the editable fields of an
   * existing portfolio through the service layer.
   *
   * @param input - Payload with the target portfolio id
   *                and field updates.
   *
   * @returns The updated portfolio.
   *
   * @example
   * const PORTFOLIO = await UPDATE_PORTFOLIO_USE_CASE.execute({
   *   portfolioId: "portfolio-1",
   *   annualInterestRate: "10.5",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: UpdatePortfolioInput
  ): Promise<PortfolioResponseDTO> {
    const ID = EntityId.create(input.portfolioId)
    const PORTFOLIO = await this.portfolioRepository.findById(ID)
    if (!PORTFOLIO) {
      throw new NotFoundError("`Portfolio` not found.")
    }
    if (input.userId && PORTFOLIO.userId !== input.userId) {
      throw new NotFoundError("`Portfolio` not found.")
    }
    let UPDATED = PORTFOLIO
    if (input.acronym !== undefined) {
      UPDATED = UPDATED.updateAcronym(input.acronym)
    }
    if (input.name !== undefined) {
      UPDATED = UPDATED.updateName(input.name)
    }
    if (input.annualInterestRate !== undefined) {
      UPDATED = UPDATED.updateAnnualInterestRate(
        SignedPercentage.create(input.annualInterestRate)
      )
    }
    if (
      input.minAllocation !== undefined ||
      input.targetAllocation !== undefined ||
      input.maxAllocation !== undefined
    ) {
      UPDATED = UPDATED.updateAllocation(
        input.minAllocation !== undefined
          ? SignedPercentage.create(input.minAllocation)
          : UPDATED.minAllocation,
        input.targetAllocation !== undefined
          ? SignedPercentage.create(input.targetAllocation)
          : UPDATED.targetAllocation,
        input.maxAllocation !== undefined
          ? SignedPercentage.create(input.maxAllocation)
          : UPDATED.maxAllocation
      )
    }
    const SAVED = await this.portfolioRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}
