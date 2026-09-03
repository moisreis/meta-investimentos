import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";

import type { PortfolioDto } from "./portfolio.dtos";
import { toPortfolioDto } from "./portfolio.dtos";

/**
 * Input for {@link createPortfolio}.
 */
export interface CreatePortfolioInput {
  /**
   * The id of the authenticated actor who will own the portfolio.
   */
  actorId: string;

  /**
   * The portfolio acronym.
   */
  acronym: string;

  /**
   * The portfolio name.
   */
  name: string;

  /**
   * The annual interest rate, as a decimal string.
   */
  annualInterestRate: string;

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
 * Creates a portfolio owned by the actor.
 *
 * The portfolio is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The portfolio properties.
 * @returns The created {@link PortfolioDto}.
 *
 * @throws {ValidationError} When any property violates a portfolio
 *   invariant.
 */
export async function createPortfolio(
  unitOfWork: UnitOfWork,
  input: CreatePortfolioInput,
): Promise<PortfolioDto> {
  return unitOfWork.run(
    async (tx) => {
      const portfolio = Portfolio.create({
        acronym: input.acronym,
        name: input.name,
        userId: EntityId.create(input.actorId),
        annualInterestRate: SignedPercentage.create(input.annualInterestRate),
        minAllocation: SignedPercentage.create(input.minAllocation),
        maxAllocation: SignedPercentage.create(input.maxAllocation),
        targetAllocation: SignedPercentage.create(input.targetAllocation),
      });

      const saved = await tx.portfolios.save(portfolio);

      return toPortfolioDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
