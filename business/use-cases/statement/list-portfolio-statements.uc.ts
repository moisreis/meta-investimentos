import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { StatementDto } from "./statement.dtos";
import { toStatementDto } from "./statement.dtos";

/**
 * Input for {@link listPortfolioStatements}.
 */
export interface ListPortfolioStatementsInput {
  /**
   * The id of the portfolio to list statements for.
   */
  portfolioId: string;
}

/**
 * Lists the statements of a portfolio.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The portfolio id.
 * @returns The {@link StatementDto}s of the portfolio.
 */
export async function listPortfolioStatements(
  ctx: Pick<UnitOfWorkContext, "statements">,
  input: ListPortfolioStatementsInput,
): Promise<StatementDto[]> {
  const statements = await ctx.statements.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  return statements.map(toStatementDto);
}
