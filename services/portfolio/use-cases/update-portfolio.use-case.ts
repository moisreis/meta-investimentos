import { Portfolio } from "@domain/portfolio/entities/portfolio.entity"
import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { INormsPortfolios } from "@domain/norms-portfolio/interfaces/norms-portfolios.interface"
import { NormsPortfolios } from "@domain/norms-portfolio/entities/norms-portfolios.entity"
import { NotFoundError } from "@errors/not-found.error"
import { toCreateNormsPortfoliosProps } from "@/services/norms-portfolio/mappers/norms-portfolio.mapper"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { PortfolioNormAllocationDTO } from "../dto/portfolio-norm-allocation.dto"
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
  norms?: PortfolioNormAllocationDTO[]
}

/**
 * @summary
 * Updates an existing `Portfolio`.
 *
 * @remarks
 * Fetches the portfolio, applies `updateAnnualInterestRate`
 * and `updateAllocation` for the provided fields, and
 * persists the updated entity. The norm-portfolio relations
 * are then reconciled against the submitted list: the norms
 * that are gone are detached, the ones that remain are
 * re-bounded and the new ones are attached.
 *
 * @explanation
 * Use this use case to edit the editable fields of an
 * existing portfolio through the service layer.
 *
 * @example
 * const PORTFOLIO = await UPDATE_PORTFOLIO_USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 *   annualInterestRate: "10.5",
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
export class UpdatePortfolioUseCase {
  constructor(
    private portfolioRepository: IPortfolio,
    private normsPortfoliosRepository: INormsPortfolios
  ) {}

  /**
   * @summary
   * Updates and persists a portfolio.
   *
   * @remarks
   * Fetches the portfolio, applies `updateAnnualInterestRate`
   * and `updateAllocation` for the provided fields, and
   * persists the updated entity. The norm-portfolio
   * relations are then reconciled against the submitted
   * list. Omitting `norms` leaves the relations untouched,
   * so a caller that only renames a portfolio cannot drop
   * the norms the user configured earlier.
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
    const PORTFOLIO = await this.ResolveOwnedPortfolio(input)
    const SAVED = await this.portfolioRepository.save(
      this.ApplyFields(PORTFOLIO, input)
    )
    const PORTFOLIO_ID = SAVED.id

    if (PORTFOLIO_ID && input.norms !== undefined) {
      await this.SyncNormRelations(input.norms, PORTFOLIO_ID)
    }

    return toResponseDTO(SAVED)
  }

  /**
   * @summary
   * Resolves the portfolio the payload targets.
   *
   * @remarks
   * Ownership is enforced from the session user id rather
   * than from anything the payload may claim, so a caller
   * cannot edit the portfolio of another user by guessing
   * its id.
   *
   * @explanation
   * Use this method at the top of `execute`, so the
   * ownership check happens before anything is written.
   *
   * @param input - Payload with the target portfolio id and
   *                the acting user id.
   *
   * @returns The resolved portfolio.
   *
   * @example
   * const PORTFOLIO = await this.ResolveOwnedPortfolio(INPUT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private async ResolveOwnedPortfolio(
    input: UpdatePortfolioInput
  ): Promise<Portfolio> {
    const PORTFOLIO = await this.portfolioRepository.findById(
      EntityId.create(input.portfolioId)
    )

    if (!PORTFOLIO) {
      throw new NotFoundError("`Portfolio` not found.")
    }

    if (input.userId && PORTFOLIO.userId !== input.userId) {
      throw new NotFoundError("`Portfolio` not found.")
    }

    return PORTFOLIO
  }

  /**
   * @summary
   * Rebuilds the portfolio with the fields the payload sets.
   *
   * @remarks
   * Only the fields the payload carries are applied, and the
   * three allocation bounds are applied together so the
   * entity can re-check that the minimum still does not
   * exceed the target and that the target still does not
   * exceed the maximum.
   *
   * @explanation
   * Use this method to keep `execute` a read, a write and a
   * reconcile, rather than a chain of conditionals.
   *
   * @param portfolio - The resolved portfolio.
   * @param input - Payload with the field updates.
   *
   * @returns The rebuilt portfolio.
   *
   * @example
   * const UPDATED = this.ApplyFields(PORTFOLIO, INPUT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private ApplyFields(
    portfolio: Portfolio,
    input: UpdatePortfolioInput
  ): Portfolio {
    let UPDATED = portfolio

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

    return UPDATED
  }

  /**
   * @summary
   * Reconciles the relations against the submitted norms.
   *
   * @remarks
   * The submitted list is the whole truth about the norms of
   * the portfolio: a relation the user removed is detached, a
   * relation the user kept is re-bounded with the numbers
   * shown on screen, and a relation the user added is
   * attached. Every bound goes through the entity, so a range
   * the user typed that breaks min <= target <= max aborts
   * the call instead of being stored.
   *
   * @explanation
   * Use this method from `execute` after the portfolio row
   * exists, because a relation is keyed on its portfolio id.
   *
   * @param norms - The norms the form submitted.
   * @param portfolioId - Id of the saved portfolio.
   *
   * @returns A promise resolved once every relation matches.
   *
   * @example
   * await this.SyncNormRelations(NORMS, PORTFOLIO_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-10-04
   */
  private async SyncNormRelations(
    norms: PortfolioNormAllocationDTO[],
    portfolioId: EntityId
  ): Promise<void> {
    const EXISTING =
      await this.normsPortfoliosRepository.findAllByPortfolioId(
        portfolioId
      )
    const SUBMITTED = new Set(norms.map((norm) => norm.normId))

    for (const relation of EXISTING) {
      if (SUBMITTED.has(relation.normId)) continue

      await this.normsPortfoliosRepository.delete(
        relation.normId,
        portfolioId
      )
    }

    for (const norm of norms) {
      await this.SaveNormRelation(norm, portfolioId)
    }
  }

  /**
   * @summary
   * Stores the relation of one submitted norm.
   *
   * @remarks
   * A relation that already exists is re-bounded rather than
   * recreated, which keeps its creation date and lets the
   * repository upsert on the composite key.
   *
   * @explanation
   * Use this method from `SyncNormRelations`, once per
   * submitted norm.
   *
   * @param norm - The norm the form submitted.
   * @param portfolioId - Id of the saved portfolio.
   *
   * @returns A promise resolved once the relation is saved.
   *
   * @example
   * await this.SaveNormRelation(NORM, PORTFOLIO_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-10-04
   */
  private async SaveNormRelation(
    norm: PortfolioNormAllocationDTO,
    portfolioId: EntityId
  ): Promise<void> {
    const NORM_ID = EntityId.create(norm.normId)
    const EXISTING =
      await this.normsPortfoliosRepository.findByNormIdAndPortfolioId(
        NORM_ID,
        portfolioId
      )

    if (!EXISTING) {
      await this.normsPortfoliosRepository.save(
        NormsPortfolios.create(
          toCreateNormsPortfoliosProps({
            normId: norm.normId,
            portfolioId,
            minAllocation: norm.minAllocation,
            targetAllocation: norm.targetAllocation,
            maxAllocation: norm.maxAllocation,
          })
        )
      )

      return
    }

    await this.normsPortfoliosRepository.save(
      EXISTING.updateAllocation(
        SignedPercentage.create(norm.minAllocation),
        SignedPercentage.create(norm.targetAllocation),
        SignedPercentage.create(norm.maxAllocation)
      )
    )
  }
}
