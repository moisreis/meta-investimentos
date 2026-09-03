import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { ApplicationDto } from "./application.dtos";
import { toApplicationDto } from "./application.dtos";

/**
 * Input for {@link listPositionApplications}.
 */
export interface ListPositionApplicationsInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position whose applications are listed.
   */
  positionId: string;
}

/**
 * Lists all applications of a position the actor can access.
 *
 * Access is enforced by resolving the position's portfolio access.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the position id.
 * @returns The {@link ApplicationDto}s of the position.
 *
 * @throws {NotFoundError} When the position or its portfolio is not
 *   accessible.
 */
export async function listPositionApplications(
  ctx: Pick<
    UnitOfWorkContext,
    "portfolios" | "portfolioPermissions" | "positions" | "applications"
  >,
  input: ListPositionApplicationsInput,
): Promise<ApplicationDto[]> {
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

  const applications = await ctx.applications.findAllByPositionId(
    EntityId.create(input.positionId),
  );

  return applications.map((a) => toApplicationDto(a));
}
