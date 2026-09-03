import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { ApplicationDto } from "./application.dtos";
import { toApplicationDto } from "./application.dtos";

/**
 * Input for {@link getApplication}.
 */
export interface GetApplicationInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the application to retrieve.
   */
  applicationId: string;
}

/**
 * Retrieves a single application the actor can access.
 *
 * Access is enforced by resolving the application's position portfolio
 * access.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the application id.
 * @returns The {@link ApplicationDto}.
 *
 * @throws {NotFoundError} When the application or its portfolio is not
 *   accessible.
 */
export async function getApplication(
  ctx: Pick<
    UnitOfWorkContext,
    "portfolios" | "portfolioPermissions" | "positions" | "applications"
  >,
  input: GetApplicationInput,
): Promise<ApplicationDto> {
  const application = await ctx.applications.findById(
    EntityId.create(input.applicationId),
  );

  if (application === null) {
    throw new NotFoundError(
      `Application with id ${input.applicationId} was not found.`,
    );
  }

  const position = await ctx.positions.findById(application.positionId);

  if (position === null) {
    throw new NotFoundError(
      `Position with id ${application.positionId} was not found.`,
    );
  }

  await resolvePortfolioAccess(
    ctx,
    position.portfolioId,
    EntityId.create(input.actorId),
  );

  return toApplicationDto(application);
}
