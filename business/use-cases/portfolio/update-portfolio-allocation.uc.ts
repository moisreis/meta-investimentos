import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PortfolioDto } from "./portfolio.dtos";
import { toPortfolioDto } from "./portfolio.dtos";

/**
 * Input for {@link updatePortfolioAllocation}.
 */
export interface UpdatePortfolioAllocationInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to update.
   */
  portfolioId: string;

  /**
   * The new minimum allocation, as a decimal string.
   */
  minAllocation: string;

  /**
   * The new target allocation, as a decimal string.
   */
  targetAllocation: string;

  /**
   * The new maximum allocation, as a decimal string.
   */
  maxAllocation: string;
}

/**
 * Updates the allocation targets of a portfolio.
 *
 * Only the owner or an editor may change allocation targets. The
 * transition is performed by {@link Portfolio.updateAllocation} and the
 * update runs inside one `UnitOfWork` transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, portfolio, and new allocation bounds.
 * @returns The updated {@link PortfolioDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function updatePortfolioAllocation(
  unitOfWork: UnitOfWork,
  input: UpdatePortfolioAllocationInput,
): Promise<PortfolioDto> {
  return unitOfWork.run(
    async (tx) => {
      const { portfolio, role } = await resolvePortfolioAccess(
        tx,
        EntityId.create(input.portfolioId),
        EntityId.create(input.actorId),
      );

      if (!canMutatePortfolio(role)) {
        throw new NotFoundError(
          `Portfolio with id ${input.portfolioId} was not found.`,
        );
      }

      const updated = portfolio.updateAllocation(
        SignedPercentage.create(input.minAllocation),
        SignedPercentage.create(input.targetAllocation),
        SignedPercentage.create(input.maxAllocation),
      );

      const saved = await tx.portfolios.save(updated);

      return toPortfolioDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
