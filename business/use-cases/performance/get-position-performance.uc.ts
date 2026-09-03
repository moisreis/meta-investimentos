import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PositionPerformanceDto } from "./performance.dtos";
import { toPositionPerformanceDto } from "./performance.dtos";

/**
 * Input for {@link getPositionPerformance}.
 */
export interface GetPositionPerformanceInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position performance to retrieve.
   */
  performanceId: string;
}

/**
 * Retrieves a single position performance for a position the actor can
 * access.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the performance id.
 * @returns The {@link PositionPerformanceDto}.
 *
 * @throws {NotFoundError} When the performance or its portfolio is not
 *   accessible.
 */
export async function getPositionPerformance(
  ctx: Pick<
    UnitOfWorkContext,
    "positionPerformances" | "positions" | "portfolios" | "portfolioPermissions"
  >,
  input: GetPositionPerformanceInput,
): Promise<PositionPerformanceDto> {
  const performance = await ctx.positionPerformances.findById(
    EntityId.create(input.performanceId),
  );

  if (performance === null) {
    throw new NotFoundError(
      `Position performance with id ${input.performanceId} was not found.`,
    );
  }

  const position = await ctx.positions.findById(performance.positionId);

  if (position === null) {
    throw new NotFoundError(
      `Position with id ${performance.positionId} was not found.`,
    );
  }

  await resolvePortfolioAccess(
    ctx,
    position.portfolioId,
    EntityId.create(input.actorId),
  );

  return toPositionPerformanceDto(performance);
}
