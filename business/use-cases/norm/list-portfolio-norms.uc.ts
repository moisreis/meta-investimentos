import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { NormsPortfoliosDto } from "./norm.dtos";
import { toNormsPortfoliosDto } from "./norm.dtos";

/**
 * Input for {@link listPortfolioNorms}.
 */
export interface ListPortfolioNormsInput {
  /**
   * The id of the portfolio to list norms for.
   */
  portfolioId: string;
}

/**
 * Lists the norms applied to a portfolio.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The portfolio id.
 * @returns The {@link NormsPortfoliosDto}s of the portfolio.
 */
export async function listPortfolioNorms(
  ctx: Pick<UnitOfWorkContext, "normsPortfolios">,
  input: ListPortfolioNormsInput,
): Promise<NormsPortfoliosDto[]> {
  const relations = await ctx.normsPortfolios.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  return relations.map(toNormsPortfoliosDto);
}
