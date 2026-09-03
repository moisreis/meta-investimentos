import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { WithdrawalDto } from "./withdrawal.dtos";
import { toWithdrawalDto } from "./withdrawal.dtos";

/**
 * Input for {@link getWithdrawal}.
 */
export interface GetWithdrawalInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the withdrawal to retrieve.
   */
  withdrawalId: string;
}

/**
 * Retrieves a single withdrawal the actor can access.
 *
 * Access is enforced by resolving the withdrawal's position portfolio
 * access.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the withdrawal id.
 * @returns The {@link WithdrawalDto}.
 *
 * @throws {NotFoundError} When the withdrawal or its portfolio is not
 *   accessible.
 */
export async function getWithdrawal(
  ctx: Pick<
    UnitOfWorkContext,
    "portfolios" | "portfolioPermissions" | "positions" | "withdrawals"
  >,
  input: GetWithdrawalInput,
): Promise<WithdrawalDto> {
  const withdrawal = await ctx.withdrawals.findById(
    EntityId.create(input.withdrawalId),
  );

  if (withdrawal === null) {
    throw new NotFoundError(
      `Withdrawal with id ${input.withdrawalId} was not found.`,
    );
  }

  const position = await ctx.positions.findById(withdrawal.positionId);

  if (position === null) {
    throw new NotFoundError(
      `Position with id ${withdrawal.positionId} was not found.`,
    );
  }

  await resolvePortfolioAccess(
    ctx,
    position.portfolioId,
    EntityId.create(input.actorId),
  );

  return toWithdrawalDto(withdrawal);
}
