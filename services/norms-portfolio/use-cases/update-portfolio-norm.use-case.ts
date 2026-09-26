import { NormsPortfolios } from "@domain/norms-portfolio/entities/norms-portfolios.entity"
import { INormsPortfolios } from "@domain/norms-portfolio/interfaces/norms-portfolios.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { NormPortfolioResponseDTO } from "../dto/norm-portfolio-response.dto"
import { toResponseDTO } from "../mappers/norms-portfolio.mapper"

export interface UpdatePortfolioNormInput {
  normId: string
  portfolioId: string
  minAllocation?: string
  maxAllocation?: string
  targetAllocation?: string
}

/**
 * @summary
 * Updates the relation of a `Norm` in a `Portfolio`.
 *
 * @remarks
 * Fetches the existing relation, rebuilds it with the
 * merged allocation fields, and upserts the updated
 * entity.
 *
 * @explanation
 * Use this use case to adjust the allocation limits of
 * an existing norm-portfolio relation through the
 * service layer.
 *
 * @example
 * const RELATION = await UPDATE_PORTFOLIO_NORM_USE_CASE
 *   .execute({
 *     normId: "norm-1",
 *     portfolioId: "portfolio-1",
 *     targetAllocation: "15",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdatePortfolioNormUseCase {
  constructor(
    private normsPortfoliosRepository: INormsPortfolios
  ) {}

  /**
   * @summary
   * Updates and upserts the norm-portfolio relation.
   *
   * @remarks
   * Fetches the existing relation, rebuilds it with the
   * merged allocation fields, and upserts the updated
   * entity.
   *
   * @explanation
   * Use this method to adjust the allocation limits of
   * an existing norm-portfolio relation through the
   * service layer.
   *
   * @param input - Payload with the relation keys and
   *                allocation updates.
   *
   * @returns The updated relation.
   *
   * @example
   * const RELATION = await UPDATE_PORTFOLIO_NORM_USE_CASE
   *   .execute({
   *     normId: "norm-1",
   *     portfolioId: "portfolio-1",
   *     targetAllocation: "15",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: UpdatePortfolioNormInput
  ): Promise<NormPortfolioResponseDTO> {
    const NORM_ID = EntityId.create(input.normId)
    const PORTFOLIO_ID = EntityId.create(input.portfolioId)
    const EXISTING =
      await this.normsPortfoliosRepository.findByNormIdAndPortfolioId(
        NORM_ID,
        PORTFOLIO_ID
      )
    if (!EXISTING) {
      throw new NotFoundError(
        "`NormPortfolio` relation not found."
      )
    }
    const UPDATED = NormsPortfolios.create(
      {
        normId: EXISTING.normId,
        portfolioId: EXISTING.portfolioId,
        minAllocation: input.minAllocation
          ? SignedPercentage.create(input.minAllocation)
          : EXISTING.minAllocation,
        maxAllocation: input.maxAllocation
          ? SignedPercentage.create(input.maxAllocation)
          : EXISTING.maxAllocation,
        targetAllocation: input.targetAllocation
          ? SignedPercentage.create(input.targetAllocation)
          : EXISTING.targetAllocation,
      },
      EXISTING.id as string
    )
    const SAVED =
      await this.normsPortfoliosRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}
