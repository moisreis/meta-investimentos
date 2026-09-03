import { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import type { NormsPortfoliosDto } from "./norm.dtos";
import { toNormsPortfoliosDto } from "./norm.dtos";

/**
 * Input for {@link applyNormToPortfolio}.
 */
export interface ApplyNormToPortfolioInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the norm to apply.
   */
  normId: string;

  /**
   * The id of the portfolio the norm is applied to.
   */
  portfolioId: string;

  /**
   * The minimum allocation, as a decimal string.
   */
  minAllocation: string;

  /**
   * The maximum allocation, as a decimal string.
   */
  maxAllocation: string;

  /**
   * The target allocation, as a decimal string.
   */
  targetAllocation: string;
}

/**
 * Applies a norm to a portfolio.
 *
 * The relation is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically. The actor must be able
 * to mutate the portfolio.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The norm, the portfolio and the applied allocations.
 * @returns The created {@link NormsPortfoliosDto}.
 *
 * @throws {ValidationError} When the norm is already applied to the
 *   portfolio.
 * @throws {NotFoundError} When the norm or the portfolio is not found
 *   or accessible.
 */
export async function applyNormToPortfolio(
  unitOfWork: UnitOfWork,
  input: ApplyNormToPortfolioInput,
): Promise<NormsPortfoliosDto> {
  return unitOfWork.run(
    async (tx) => {
      const normId = EntityId.create(input.normId);
      const portfolioId = EntityId.create(input.portfolioId);

      const norm = await tx.norms.findById(normId);

      if (norm === null) {
        throw new NotFoundError(`Norm with id ${input.normId} was not found.`);
      }

      const { role } = await resolvePortfolioAccess(
        tx,
        portfolioId,
        EntityId.create(input.actorId),
      );

      if (!canMutatePortfolio(role)) {
        throw new NotFoundError(
          `Portfolio with id ${input.portfolioId} was not found.`,
        );
      }

      const existing = await tx.normsPortfolios.findByNormIdAndPortfolioId(
        normId,
        portfolioId,
      );

      if (existing !== null) {
        throw new ValidationError(
          `Norm ${input.normId} is already applied to portfolio ${input.portfolioId}.`,
        );
      }

      const relation = NormsPortfolios.create({
        normId,
        portfolioId,
        minAllocation: SignedPercentage.create(input.minAllocation),
        maxAllocation: SignedPercentage.create(input.maxAllocation),
        targetAllocation: SignedPercentage.create(input.targetAllocation),
      });

      const saved = await tx.normsPortfolios.save(relation);

      return toNormsPortfoliosDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
