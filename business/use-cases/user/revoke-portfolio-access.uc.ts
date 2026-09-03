import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

/**
 * Input for {@link revokePortfolioAccess}.
 */
export interface RevokePortfolioAccessInput {
  /**
   * The id of the acting user who must own the portfolio.
   */
  actorId: string;

  /**
   * The id of the user whose access is revoked.
   */
  userId: string;

  /**
   * The id of the portfolio the user has access to.
   */
  portfolioId: string;
}

/**
 * Revokes a user's access to a portfolio.
 *
 * Only the portfolio owner may revoke access. The revocation runs
 * inside one `UnitOfWork` transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, granted user, and portfolio.
 *
 * @throws {NotFoundError} When the portfolio does not exist, the actor
 *   is not its owner, or the permission does not exist.
 */
export async function revokePortfolioAccess(
  unitOfWork: UnitOfWork,
  input: RevokePortfolioAccessInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      const portfolio = await tx.portfolios.findById(
        EntityId.create(input.portfolioId),
      );

      if (portfolio === null || portfolio.userId !== input.actorId) {
        throw new NotFoundError(
          `Portfolio with id ${input.portfolioId} was not found.`,
        );
      }

      const permission =
        await tx.portfolioPermissions.findByUserIdAndPortfolioId(
          EntityId.create(input.userId),
          EntityId.create(input.portfolioId),
        );

      if (permission === null) {
        throw new NotFoundError(
          `Portfolio access for user ${input.userId} on portfolio ${input.portfolioId} was not found.`,
        );
      }

      await tx.portfolioPermissions.delete(permission.id as EntityId);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
