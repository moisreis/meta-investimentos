import type { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import type { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

/**
 * Represents the access level of an actor over a portfolio.
 */
export type PortfolioAccessRole = "OWNER" | "VIEWER" | "EDITOR";

/**
 * The repository surface required to resolve portfolio access.
 */
export interface PortfolioAccessRepositories {
  portfolios: {
    findById(id: EntityId): Promise<Portfolio | null>;
  };
  portfolioPermissions: {
    findByUserIdAndPortfolioId(
      userId: EntityId,
      portfolioId: EntityId,
    ): Promise<PortfolioPermission | null>;
  };
}

/**
 * Resolves the portfolio and the actor's access role over it.
 *
 * Ownership grants `OWNER` access. A portfolio permission grants the
 * stored role. When the portfolio does not exist or the actor has no
 * access, a `NotFoundError` is thrown so callers do not leak whether a
 * portfolio exists.
 *
 * @param repos - The repositories to load portfolio and permission.
 * @param portfolioId - The id of the portfolio to resolve.
 * @param actorId - The id of the acting user.
 * @returns The portfolio and the actor's access role.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function resolvePortfolioAccess(
  repos: PortfolioAccessRepositories,
  portfolioId: EntityId,
  actorId: EntityId,
): Promise<{ portfolio: Portfolio; role: PortfolioAccessRole }> {
  const portfolio = await repos.portfolios.findById(portfolioId);

  if (portfolio === null) {
    throw new NotFoundError(`Portfolio with id ${portfolioId} was not found.`);
  }

  if (portfolio.userId === actorId) {
    return { portfolio, role: "OWNER" };
  }

  const permission =
    await repos.portfolioPermissions.findByUserIdAndPortfolioId(
      actorId,
      portfolioId,
    );

  if (permission !== null) {
    return { portfolio, role: permission.role };
  }

  throw new NotFoundError(`Portfolio with id ${portfolioId} was not found.`);
}

/**
 * Determines whether an access role permits mutations.
 *
 * Only the owner and editors may mutate portfolio data. Viewers may
 * only read.
 *
 * @param role - The resolved access role.
 * @returns `true` when the role can mutate.
 */
export function canMutatePortfolio(role: PortfolioAccessRole): boolean {
  return role === "OWNER" || role === "EDITOR";
}
