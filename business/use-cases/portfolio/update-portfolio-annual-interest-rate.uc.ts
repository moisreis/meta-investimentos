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
 * Input for {@link updatePortfolioAnnualInterestRate}.
 */
export interface UpdatePortfolioAnnualInterestRateInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to update.
   */
  portfolioId: string;

  /**
   * The new annual interest rate, as a decimal string.
   */
  annualInterestRate: string;
}

/**
 * Updates the annual interest rate of a portfolio.
 *
 * Only the owner or an editor may change the annual interest rate. The
 * transition is performed by
 * {@link Portfolio.updateAnnualInterestRate} and the update runs inside
 * one `UnitOfWork` transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, portfolio, and new interest rate.
 * @returns The updated {@link PortfolioDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function updatePortfolioAnnualInterestRate(
  unitOfWork: UnitOfWork,
  input: UpdatePortfolioAnnualInterestRateInput,
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

      const updated = portfolio.updateAnnualInterestRate(
        SignedPercentage.create(input.annualInterestRate),
      );

      const saved = await tx.portfolios.save(updated);

      return toPortfolioDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
