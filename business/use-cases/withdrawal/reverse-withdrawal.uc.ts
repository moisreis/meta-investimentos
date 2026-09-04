import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { recalculatePerformanceForPortfolios } from "../performance/recalculate-performance-triggers";
import type { WithdrawalDto } from "./withdrawal.dtos";
import { toWithdrawalDto } from "./withdrawal.dtos";

/**
 * Input for {@link reverseWithdrawal}.
 */
export interface ReverseWithdrawalInput {
  /**
   * The id of the authenticated actor reversing the withdrawal.
   */
  actorId: string;

  /**
   * The id of the withdrawal to reverse.
   */
  withdrawalId: string;
}

/**
 * Reverses a withdrawal.
 *
 * The action loads the withdrawal and its position, resolves the
 * portfolio access, and transitions the withdrawal to a reversed state
 * via {@link Withdrawal.reverse}. The transaction allocations that
 * consumed quotas for this withdrawal are removed — reverting the FIFO
 * allocation atomically — and the updated withdrawal is saved, all
 * within one `UnitOfWork` transaction.
 *
 * Once the write transaction commits, the affected portfolio's
 * performance is recalculated from the withdrawal date forward, so
 * reversing a withdrawal propagates to the historical snapshots.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor and the withdrawal id.
 * @returns The reversed {@link WithdrawalDto}.
 *
 * @throws {NotFoundError} When the withdrawal or its portfolio is not
 *   accessible.
 * @throws {ValidationError} When the withdrawal is already reversed.
 */
export async function reverseWithdrawal(
  unitOfWork: UnitOfWork,
  input: ReverseWithdrawalInput,
): Promise<WithdrawalDto> {
  const { dto, date, portfolioId } = await unitOfWork.run(
    async (tx) => {
      const withdrawal = await tx.withdrawals.findById(
        EntityId.create(input.withdrawalId),
      );

      if (withdrawal === null) {
        throw new NotFoundError(
          `Withdrawal with id ${input.withdrawalId} was not found.`,
        );
      }

      const position = await tx.positions.findById(withdrawal.positionId);

      if (position === null) {
        throw new NotFoundError(
          `Position with id ${withdrawal.positionId} was not found.`,
        );
      }

      const { role } = await resolvePortfolioAccess(
        tx,
        position.portfolioId,
        EntityId.create(input.actorId),
      );

      if (!canMutatePortfolio(role)) {
        throw new NotFoundError(
          `Portfolio with id ${position.portfolioId} was not found.`,
        );
      }

      const reversed = withdrawal.reverse(EntityId.create(input.actorId));

      const allocations = await tx.transactionAllocations.findAllByWithdrawalId(
        EntityId.create(input.withdrawalId),
      );

      for (const allocation of allocations) {
        if (allocation.id === undefined) {
          continue;
        }
        await tx.transactionAllocations.delete(allocation.id);
      }

      const saved = await tx.withdrawals.save(reversed);

      return {
        dto: toWithdrawalDto(saved),
        date: withdrawal.date,
        portfolioId: position.portfolioId as string,
      };
    },
    { userId: EntityId.create(input.actorId) },
  );

  await recalculatePerformanceForPortfolios(unitOfWork, {
    portfolioIds: [portfolioId],
    startDate: date,
    endDate: new Date(),
    actorId: input.actorId,
  });

  return dto;
}
