import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PortfolioAccessDto } from "./portfolio-permission.dtos";
import { toPortfolioAccessDto } from "./portfolio-permission.mapper";

/**
 * Input for {@link listPortfolioAccess}.
 */
export interface ListPortfolioAccessInput {
  /**
   * The id of the acting user who must own the portfolio.
   */
  actorId: string;

  /**
   * The id of the portfolio whose access entries are listed.
   */
  portfolioId: string;
}

/**
 * Lists all users granted access to a portfolio.
 *
 * Only the portfolio owner may list the access entries. The read runs
 * through the transaction-scoped repositories.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the portfolio.
 * @returns The collection of {@link PortfolioAccessDto}.
 *
 * @throws {NotFoundError} When the portfolio does not exist or the
 *   actor is not its owner.
 */
export async function listPortfolioAccess(
  ctx: Pick<UnitOfWorkContext, "portfolios" | "portfolioPermissions" | "users">,
  input: ListPortfolioAccessInput,
): Promise<PortfolioAccessDto[]> {
  const portfolio = await ctx.portfolios.findById(
    EntityId.create(input.portfolioId),
  );

  if (portfolio === null || portfolio.userId !== input.actorId) {
    throw new NotFoundError(
      `Portfolio with id ${input.portfolioId} was not found.`,
    );
  }

  const permissions = await ctx.portfolioPermissions.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  const grantedUserIds = permissions.map((p) => p.userId);
  const users = await ctx.users.findAllByIds(grantedUserIds);
  const usersById = new Map(users.map((u) => [u.id as string, u]));

  return permissions.map((permission) => {
    const grantedUser = usersById.get(permission.userId);
    return toPortfolioAccessDto(
      permission,
      grantedUser?.name ?? "Unknown",
      grantedUser?.email ?? "unknown",
      grantedUser?.role ?? "USER",
    );
  });
}
