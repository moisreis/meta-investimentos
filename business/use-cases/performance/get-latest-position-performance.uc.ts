import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PositionPerformanceDto } from "./performance.dtos";
import { toPositionPerformanceDto } from "./performance.dtos";

/**
 * Input for {@link getLatestPositionPerformance}.
 */
export interface GetLatestPositionPerformanceInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position to retrieve the latest performance for.
   */
  positionId: string;
}

/**
 * Retrieves the most recent performance of a position the actor can
 * access.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the position id.
 * @returns The latest {@link PositionPerformanceDto}.
 *
 * @throws {NotFoundError} When the position or its portfolio is not
 *   accessible.
 */
export async function getLatestPositionPerformance(
  ctx: Pick<
    UnitOfWorkContext,
    "positionPerformances" | "positions" | "portfolios" | "portfolioPermissions"
  >,
  input: GetLatestPositionPerformanceInput,
): Promise<PositionPerformanceDto> {
  const positionId = EntityId.create(input.positionId);

  const position = await ctx.positions.findById(positionId);

  if (position === null) {
    throw new NotFoundError(
      `Position with id ${input.positionId} was not found.`,
    );
  }

  await resolvePortfolioAccess(
    ctx,
    position.portfolioId,
    EntityId.create(input.actorId),
  );

  const performance =
    await ctx.positionPerformances.findLatestByPositionId(positionId);

  if (performance === null) {
    throw new NotFoundError(
      `No position performance found for position ${input.positionId}.`,
    );
  }

  return toPositionPerformanceDto(performance);
}
