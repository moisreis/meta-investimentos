import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { PositionDto } from "./position.dtos";
import { toPositionDto } from "./position.dtos";

/**
 * Input for {@link listPortfolioPositions}.
 */
export interface ListPortfolioPositionsInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio whose positions are listed.
   */
  portfolioId: string;
}

/**
 * Lists all positions of a portfolio the actor can access.
 *
 * Access is enforced by resolving the portfolio's access before listing
 * its positions.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the portfolio id.
 * @returns The {@link PositionDto}s of the portfolio.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function listPortfolioPositions(
  ctx: Pick<
    UnitOfWorkContext,
    "portfolios" | "portfolioPermissions" | "positions"
  >,
  input: ListPortfolioPositionsInput,
): Promise<PositionDto[]> {
  await resolvePortfolioAccess(
    ctx,
    EntityId.create(input.portfolioId),
    EntityId.create(input.actorId),
  );

  const positions = await ctx.positions.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  return positions.map((position) => toPositionDto(position));
}
