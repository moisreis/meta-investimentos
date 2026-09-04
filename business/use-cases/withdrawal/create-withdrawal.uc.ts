import Decimal from "decimal.js";
import { calculateWithdrawalQuotas } from "@/business/calculators";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { allocateWithdrawalQuotasFifo } from "./fifo-allocation.helper";
import { computeRemainingApplicationQuotas } from "./remaining-applications.helper";
import type { WithdrawalDto } from "./withdrawal.dtos";
import { toWithdrawalDto } from "./withdrawal.dtos";

/**
 * Input for {@link createWithdrawal}.
 */
export interface CreateWithdrawalInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position the withdrawal applies to.
   */
  positionId: string;

  /**
   * The date of the withdrawal.
   */
  date: Date;

  /**
   * The amount withdrawn, as a decimal string.
   */
  amount: string;
}

/**
 * Creates a withdrawal against a position.
 *
 * The action loads the position, resolves its portfolio access, loads
 * the quota price on the withdrawal date, and computes the number of
 * quotas via {@link calculateWithdrawalQuotas}. It then allocates the
 * withdrawal's quotas across the position's applications in FIFO order,
 * creating the `TransactionAllocation` records atomically within one
 * `UnitOfWork` transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, position, date, and amount.
 * @returns The created {@link WithdrawalDto}.
 *
 * @throws {NotFoundError} When the position or its portfolio is not
 *   accessible.
 * @throws {ValidationError} When the fund has no quota on the date or
 *   the position does not hold enough poolable quotas.
 *
 * @remarks
 * The available-quota check and the allocations are computed inside a
 * single transaction but do not lock the position row. Under concurrent
 * withdrawals, two transactions may over-allocate the same poolable
 * quotas; serializing the withdrawals (e.g. a row lock on the position)
 * is a known follow-up and intentionally out of scope here.
 */
export async function createWithdrawal(
  unitOfWork: UnitOfWork,
  input: CreateWithdrawalInput,
): Promise<WithdrawalDto> {
  return unitOfWork.run(
    async (tx) => {
      const position = await tx.positions.findById(
        EntityId.create(input.positionId),
      );

      if (position === null) {
        throw new NotFoundError(
          `Position with id ${input.positionId} was not found.`,
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

      const quota = await tx.quotas.findByFundIdAndDate(
        position.fundId,
        input.date,
      );

      if (quota === null) {
        throw new ValidationError(
          `No quota price is available for fund ${position.fundId} on ${input.date.toISOString()}.`,
        );
      }

      const amount = PositiveMoney.create(input.amount);
      const withdrawalQuotas = calculateWithdrawalQuotas({
        withdrawal: amount,
        quota: quota.price,
      });

      const applications = await tx.applications.findAllByPositionIdInPeriod(
        EntityId.create(input.positionId),
        new Date(0),
        input.date,
      );

      const existingAllocations: NonNullable<
        Awaited<
          ReturnType<typeof tx.transactionAllocations.findAllByApplicationId>
        >
      > = [];

      for (const application of applications) {
        const appAllocations =
          await tx.transactionAllocations.findAllByApplicationId(
            application.id as EntityId,
          );
        existingAllocations.push(...appAllocations);
      }

      const remaining = computeRemainingApplicationQuotas(
        applications,
        existingAllocations,
      );

      const totalPoolable = remaining.reduce(
        (acc, app) => acc.plus(app.quotas.value),
        new Decimal(0),
      );

      if (remaining.length === 0 || totalPoolable.lt(withdrawalQuotas.value)) {
        throw new ValidationError(
          "Position does not hold enough poolable quotas for the withdrawal.",
        );
      }

      const withdrawal = Withdrawal.create({
        positionId: EntityId.create(input.positionId),
        date: input.date,
        amount,
        quotas: withdrawalQuotas,
      });

      const saved = await tx.withdrawals.save(withdrawal);

      const allocations = allocateWithdrawalQuotasFifo(
        remaining,
        saved.id as EntityId,
        withdrawalQuotas,
      );

      for (const allocation of allocations) {
        await tx.transactionAllocations.save(allocation);
      }

      return toWithdrawalDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
