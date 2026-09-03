import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PositionDto } from "./position.dtos";
import { toPositionDto } from "./position.dtos";

/**
 * Input for {@link getPosition}.
 */
export interface GetPositionInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position to retrieve.
   */
  positionId: string;
}

/**
 * Retrieves a single position the actor can access.
 *
 * Access is enforced by resolving the position's portfolio access
 * before returning the position.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the position id.
 * @returns The {@link PositionDto}.
 *
 * @throws {NotFoundError} When the position or its portfolio is not
 *   accessible.
 */
export async function getPosition(
  ctx: Pick<
    UnitOfWorkContext,
    "portfolios" | "portfolioPermissions" | "positions"
  >,
  input: GetPositionInput,
): Promise<PositionDto> {
  const position = await ctx.positions.findById(
    EntityId.create(input.positionId),
  );

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

  return toPositionDto(position);
}
