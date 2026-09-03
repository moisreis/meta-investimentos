import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PortfolioPerformanceDto } from "./performance.dtos";
import { toPortfolioPerformanceDto } from "./performance.dtos";

/**
 * Input for {@link getPortfolioPerformance}.
 */
export interface GetPortfolioPerformanceInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio performance to retrieve.
   */
  performanceId: string;
}

/**
 * Retrieves a single portfolio performance for a portfolio the actor can
 * access.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the performance id.
 * @returns The {@link PortfolioPerformanceDto}.
 *
 * @throws {NotFoundError} When the performance or its portfolio is not
 *   accessible.
 */
export async function getPortfolioPerformance(
  ctx: Pick<
    UnitOfWorkContext,
    "portfolioPerformances" | "portfolios" | "portfolioPermissions"
  >,
  input: GetPortfolioPerformanceInput,
): Promise<PortfolioPerformanceDto> {
  const performance = await ctx.portfolioPerformances.findById(
    EntityId.create(input.performanceId),
  );

  if (performance === null) {
    throw new NotFoundError(
      `Portfolio performance with id ${input.performanceId} was not found.`,
    );
  }

  await resolvePortfolioAccess(
    ctx,
    performance.portfolioId,
    EntityId.create(input.actorId),
  );

  return toPortfolioPerformanceDto(performance);
}
