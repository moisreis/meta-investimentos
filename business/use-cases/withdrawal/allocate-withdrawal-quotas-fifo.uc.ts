import { Decimal } from "decimal.js";
import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { allocateWithdrawalQuotasFifo } from "./fifo-allocation.helper";
import { computeRemainingApplicationQuotas } from "./remaining-applications.helper";
import type { TransactionAllocationDto } from "./withdrawal.dtos";
import { toTransactionAllocationDto } from "./withdrawal.dtos";

/**
 * Input for {@link allocateWithdrawalQuotasFifoOperation}.
 */
export interface AllocateWithdrawalQuotasFifoInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the withdrawal to allocate for.
   */
  withdrawalId: string;
}

/**
 * Allocates a withdrawal's quotas across its position's applications in
 * FIFO order.
 *
 * When a withdrawal has not yet been allocated, this operation computes
 * the remaining poolable quotas for each application and creates the
 * `TransactionAllocation` records atomically within one `UnitOfWork`
 * transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor and the withdrawal id.
 * @returns The created {@link TransactionAllocationDto}s.
 *
 * @throws {NotFoundError} When the withdrawal, position, or portfolio
 *   is not accessible.
 * @throws {ValidationError} When the position does not hold enough
 *   poolable quotas or the withdrawal is already reversed/allocated.
 */
export async function allocateWithdrawalQuotasFifoOperation(
  unitOfWork: UnitOfWork,
  input: AllocateWithdrawalQuotasFifoInput,
): Promise<TransactionAllocationDto[]> {
  return unitOfWork.run(
    async (tx) => {
      const withdrawal = await tx.withdrawals.findById(
        EntityId.create(input.withdrawalId),
      );

      if (withdrawal === null) {
        throw new NotFoundError(
          `Withdrawal with id ${input.withdrawalId} was not found.`,
        );
      }

      if (withdrawal.reversedAt !== null) {
        throw new ValidationError(
          "Cannot allocate quotas for a reversed withdrawal.",
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

      const existing = await tx.transactionAllocations.findAllByWithdrawalId(
        EntityId.create(input.withdrawalId),
      );

      if (existing.length > 0) {
        throw new ValidationError("Withdrawal quotas are already allocated.");
      }

      const applications = await tx.applications.findAllByPositionId(
        withdrawal.positionId,
      );

      const allAllocations: Awaited<
        ReturnType<typeof tx.transactionAllocations.findAllByApplicationId>
      > = [];

      for (const application of applications) {
        const appAllocations =
          await tx.transactionAllocations.findAllByApplicationId(
            application.id as EntityId,
          );
        allAllocations.push(...appAllocations);
      }

      const remaining = computeRemainingApplicationQuotas(
        applications,
        allAllocations,
      );

      const totalPoolable = remaining.reduce(
        (acc, app) => acc.plus(app.quotas.value),
        new Decimal(0),
      );

      if (remaining.length === 0 || totalPoolable.lt(withdrawal.quotas.value)) {
        throw new ValidationError(
          "Position does not hold enough poolable quotas for the withdrawal.",
        );
      }

      const allocations = allocateWithdrawalQuotasFifo(
        remaining,
        EntityId.create(input.withdrawalId),
        withdrawal.quotas,
      );

      const saved: Awaited<
        ReturnType<typeof tx.transactionAllocations.save>
      >[] = [];

      for (const allocation of allocations) {
        saved.push(await tx.transactionAllocations.save(allocation));
      }

      return saved.map((a) => toTransactionAllocationDto(a));
    },
    { userId: EntityId.create(input.actorId) },
  );
}
