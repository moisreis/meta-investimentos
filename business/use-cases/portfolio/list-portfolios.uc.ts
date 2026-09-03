import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { AccessiblePortfolioDto } from "./portfolio.dtos";
import { toAccessiblePortfolioDto } from "./portfolio.dtos";

/**
 * Input for {@link listPortfolios}.
 */
export interface ListPortfoliosInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;
}

/**
 * Lists all portfolios the actor can access.
 *
 * The actor's own portfolios are combined with the portfolios they hold
 * an explicit permission on. The read runs through the transaction-
 * scoped repositories.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor id.
 * @returns The accessible-portfolio DTOs the actor can access.
 */
export async function listPortfolios(
  ctx: Pick<UnitOfWorkContext, "portfolios" | "portfolioPermissions">,
  input: ListPortfoliosInput,
): Promise<AccessiblePortfolioDto[]> {
  const owned = await ctx.portfolios.findAllByUserId(
    EntityId.create(input.actorId),
  );

  const permissions = await ctx.portfolioPermissions.findAllByUserId(
    EntityId.create(input.actorId),
  );

  const grantedPortfolioIds = permissions.map((p) => p.portfolioId);

  const granted = grantedPortfolioIds.length
    ? await ctx.portfolios.findAllByIds(grantedPortfolioIds)
    : [];

  const ownedMap = new Map(owned.map((p) => [p.id as string, p]));
  const grantedMap = new Map(granted.map((p) => [p.id as string, p]));
  const roleByPortfolio = new Map(
    permissions.map((p) => [p.portfolioId, p.role]),
  );

  const result: AccessiblePortfolioDto[] = [];

  for (const portfolio of ownedMap.values()) {
    result.push(toAccessiblePortfolioDto(portfolio, "OWNER"));
  }

  for (const portfolio of grantedMap.values()) {
    const id = portfolio.id as EntityId;
    if (ownedMap.has(id)) {
      continue;
    }
    const role = roleByPortfolio.get(id) ?? "VIEWER";
    result.push(toAccessiblePortfolioDto(portfolio, role));
  }

  return result;
}
