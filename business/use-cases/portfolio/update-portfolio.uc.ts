import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PortfolioDto } from "./portfolio.dtos";
import { toPortfolioDto } from "./portfolio.dtos";

/**
 * Input for {@link updatePortfolio}.
 */
export interface UpdatePortfolioInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to update.
   */
  portfolioId: string;

  /**
   * The updated portfolio name.
   */
  name?: string;
}

/**
 * Updates a mutable field of a portfolio.
 *
 * Only the owner may rename a portfolio; editors may not change the
 * portfolio record itself. The update runs inside one `UnitOfWork`
 * transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, portfolio, and fields to update.
 * @returns The updated {@link PortfolioDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function updatePortfolio(
  unitOfWork: UnitOfWork,
  input: UpdatePortfolioInput,
): Promise<PortfolioDto> {
  return unitOfWork.run(
    async (tx) => {
      const { portfolio, role } = await resolvePortfolioAccess(
        tx,
        EntityId.create(input.portfolioId),
        EntityId.create(input.actorId),
      );

      if (role !== "OWNER") {
        throw new NotFoundError(
          `Portfolio with id ${input.portfolioId} was not found.`,
        );
      }

      const updated = Portfolio.create(
        {
          acronym: portfolio.acronym,
          name: input.name ?? portfolio.name,
          userId: portfolio.userId,
          annualInterestRate: portfolio.annualInterestRate,
          minAllocation: portfolio.minAllocation,
          maxAllocation: portfolio.maxAllocation,
          targetAllocation: portfolio.targetAllocation,
          createdAt: portfolio.createdAt,
          updatedAt: portfolio.updatedAt,
        },
        portfolio.id as EntityId,
      );

      const saved = await tx.portfolios.save(updated);

      return toPortfolioDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
