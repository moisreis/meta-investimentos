import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import type { AccessiblePortfolioDto } from "./portfolio.dtos";
import { toAccessiblePortfolioDto } from "./portfolio.dtos";

/**
 * Input for {@link getPortfolio}.
 */
export interface GetPortfolioInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to retrieve.
   */
  portfolioId: string;
}

/**
 * Retrieves a single portfolio the actor can access.
 *
 * Access is enforced through {@link resolvePortfolioAccess}; the actor
 * must own the portfolio or hold an explicit permission on it.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the portfolio id.
 * @returns The accessible-portfolio DTO.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function getPortfolio(
  ctx: Pick<UnitOfWorkContext, "portfolios" | "portfolioPermissions">,
  input: GetPortfolioInput,
): Promise<AccessiblePortfolioDto> {
  const { portfolio, role } = await resolvePortfolioAccess(
    ctx,
    EntityId.create(input.portfolioId),
    EntityId.create(input.actorId),
  );

  return toAccessiblePortfolioDto(portfolio, role);
}
