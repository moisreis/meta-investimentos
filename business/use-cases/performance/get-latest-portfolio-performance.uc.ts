import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PortfolioPerformanceDto } from "./performance.dtos";
import { toPortfolioPerformanceDto } from "./performance.dtos";

/**
 * Input for {@link getLatestPortfolioPerformance}.
 */
export interface GetLatestPortfolioPerformanceInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to retrieve the latest performance for.
   */
  portfolioId: string;
}

/**
 * Retrieves the most recent performance of a portfolio the actor can
 * access.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the portfolio id.
 * @returns The latest {@link PortfolioPerformanceDto}.
 *
 * @throws {NotFoundError} When the portfolio is not found or accessible.
 */
export async function getLatestPortfolioPerformance(
  ctx: Pick<
    UnitOfWorkContext,
    "portfolioPerformances" | "portfolios" | "portfolioPermissions"
  >,
  input: GetLatestPortfolioPerformanceInput,
): Promise<PortfolioPerformanceDto> {
  const portfolioId = EntityId.create(input.portfolioId);

  await resolvePortfolioAccess(
    ctx,
    portfolioId,
    EntityId.create(input.actorId),
  );

  const performance =
    await ctx.portfolioPerformances.findLatestByPortfolioId(portfolioId);

  if (performance === null) {
    throw new NotFoundError(
      `No portfolio performance found for portfolio ${input.portfolioId}.`,
    );
  }

  return toPortfolioPerformanceDto(performance);
}
