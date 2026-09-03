import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { PortfolioPerformanceDto } from "./performance.dtos";
import { toPortfolioPerformanceDto } from "./performance.dtos";

/**
 * Input for {@link listPortfolioPerformances}.
 */
export interface ListPortfolioPerformancesInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to list performances for.
   */
  portfolioId: string;
}

/**
 * Lists the performances of a portfolio the actor can access.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the portfolio id.
 * @returns The {@link PortfolioPerformanceDto}s of the portfolio.
 *
 * @throws {NotFoundError} When the portfolio is not found or accessible.
 */
export async function listPortfolioPerformances(
  ctx: Pick<
    UnitOfWorkContext,
    "portfolioPerformances" | "portfolios" | "portfolioPermissions"
  >,
  input: ListPortfolioPerformancesInput,
): Promise<PortfolioPerformanceDto[]> {
  const portfolioId = EntityId.create(input.portfolioId);

  await resolvePortfolioAccess(
    ctx,
    portfolioId,
    EntityId.create(input.actorId),
  );

  const performances =
    await ctx.portfolioPerformances.findAllByPortfolioId(portfolioId);

  return performances.map(toPortfolioPerformanceDto);
}
