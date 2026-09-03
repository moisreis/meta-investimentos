import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

/**
 * Input for {@link deletePortfolio}.
 */
export interface DeletePortfolioInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to delete.
   */
  portfolioId: string;
}

/**
 * Deletes a portfolio.
 *
 * Only the owner may delete a portfolio. The deletion runs inside one
 * `UnitOfWork` transaction so the removal and its audit log commit
 * atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor and the portfolio id.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function deletePortfolio(
  unitOfWork: UnitOfWork,
  input: DeletePortfolioInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      const { role } = await resolvePortfolioAccess(
        tx,
        EntityId.create(input.portfolioId),
        EntityId.create(input.actorId),
      );

      if (role !== "OWNER") {
        throw new NotFoundError(
          `Portfolio with id ${input.portfolioId} was not found.`,
        );
      }

      await tx.portfolios.delete(EntityId.create(input.portfolioId));
    },
    { userId: EntityId.create(input.actorId) },
  );
}
