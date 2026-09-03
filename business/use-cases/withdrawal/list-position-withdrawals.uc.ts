import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { WithdrawalDto } from "./withdrawal.dtos";
import { toWithdrawalDto } from "./withdrawal.dtos";

/**
 * Input for {@link listPositionWithdrawals}.
 */
export interface ListPositionWithdrawalsInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position whose withdrawals are listed.
   */
  positionId: string;
}

/**
 * Lists all withdrawals of a position the actor can access.
 *
 * Access is enforced by resolving the position's portfolio access.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the position id.
 * @returns The {@link WithdrawalDto}s of the position.
 *
 * @throws {NotFoundError} When the position or its portfolio is not
 *   accessible.
 */
export async function listPositionWithdrawals(
  ctx: Pick<
    UnitOfWorkContext,
    "portfolios" | "portfolioPermissions" | "positions" | "withdrawals"
  >,
  input: ListPositionWithdrawalsInput,
): Promise<WithdrawalDto[]> {
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

  const withdrawals = await ctx.withdrawals.findAllByPositionId(
    EntityId.create(input.positionId),
  );

  return withdrawals.map((w) => toWithdrawalDto(w));
}
