import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

/**
 * Input for {@link removeNormFromPortfolio}.
 */
export interface RemoveNormFromPortfolioInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the norm to remove.
   */
  normId: string;

  /**
   * The id of the portfolio the norm is applied to.
   */
  portfolioId: string;
}

/**
 * Removes a norm from a portfolio.
 *
 * The relation is deleted inside one `UnitOfWork` transaction so the
 * mutation and its audit log commit atomically. The actor must be able
 * to mutate the portfolio.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The norm and the portfolio.
 *
 * @throws {ValidationError} When the norm is not applied to the
 *   portfolio.
 * @throws {NotFoundError} When the portfolio is not found or accessible.
 */
export async function removeNormFromPortfolio(
  unitOfWork: UnitOfWork,
  input: RemoveNormFromPortfolioInput,
): Promise<void> {
  return unitOfWork.run(
    async (tx) => {
      const normId = EntityId.create(input.normId);
      const portfolioId = EntityId.create(input.portfolioId);

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

      if (existing === null) {
        throw new ValidationError(
          `Norm ${input.normId} is not applied to portfolio ${input.portfolioId}.`,
        );
      }

      await tx.normsPortfolios.delete(normId, portfolioId);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
