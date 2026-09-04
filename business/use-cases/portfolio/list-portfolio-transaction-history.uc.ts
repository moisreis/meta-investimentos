import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type {
  PortfolioTransactionDto,
  PortfolioTransactionHistoryDto,
} from "./portfolio-reads.dtos";

/**
 * Input for {@link listPortfolioTransactionHistory}.
 */
export interface ListPortfolioTransactionHistoryInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio whose transaction history is listed.
   */
  portfolioId: string;
}

/**
 * Lists the application and withdrawal transactions across all positions
 * of a portfolio.
 *
 * Access is enforced by resolving the portfolio's access. Each position's
 * applications and withdrawals are mapped to a flat, ordered transaction
 * history.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the portfolio id.
 * @returns The {@link PortfolioTransactionHistoryDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function listPortfolioTransactionHistory(
  ctx: Pick<
    UnitOfWorkContext,
    | "portfolios"
    | "portfolioPermissions"
    | "positions"
    | "applications"
    | "withdrawals"
  >,
  input: ListPortfolioTransactionHistoryInput,
): Promise<PortfolioTransactionHistoryDto> {
  await resolvePortfolioAccess(
    ctx,
    EntityId.create(input.portfolioId),
    EntityId.create(input.actorId),
  );

  const positions = await ctx.positions.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  const transactions: PortfolioTransactionDto[] = [];

  for (const position of positions) {
    const positionId = position.id as EntityId;

    const applications = await ctx.applications.findAllByPositionId(positionId);
    const withdrawals = await ctx.withdrawals.findAllByPositionId(positionId);

    for (const application of applications) {
      transactions.push({
        id: application.id as EntityId,
        positionId,
        fundId: position.fundId,
        kind: "application",
        date: application.date,
        amount: application.amount.value.toString(),
        quotas: application.quotas.value.toString(),
        reversedAt: application.reversedAt,
      });
    }

    for (const withdrawal of withdrawals) {
      transactions.push({
        id: withdrawal.id as EntityId,
        positionId,
        fundId: position.fundId,
        kind: "withdrawal",
        date: withdrawal.date,
        amount: withdrawal.amount.value.toString(),
        quotas: withdrawal.quotas.value.toString(),
        reversedAt: withdrawal.reversedAt,
      });
    }
  }

  transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

  return {
    portfolioId: EntityId.create(input.portfolioId),
    transactions,
  };
}
