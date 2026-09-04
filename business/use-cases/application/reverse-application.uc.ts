import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import { recalculatePerformanceForPortfolios } from "../performance/recalculate-performance-triggers";
import type { ApplicationDto } from "./application.dtos";
import { toApplicationDto } from "./application.dtos";

/**
 * Input for {@link reverseApplication}.
 */
export interface ReverseApplicationInput {
  /**
   * The id of the authenticated actor reversing the application.
   */
  actorId: string;

  /**
   * The id of the application to reverse.
   */
  applicationId: string;
}

/**
 * Reverses an application.
 *
 * The action loads the application and its position, resolves the
 * portfolio access, and transitions the application to a reversed state
 * via {@link Application.reverse}. The transaction allocations that
 * consumed quotas from this application are removed, and the updated
 * application is saved, all within one `UnitOfWork` transaction.
 *
 * Reversal is blocked while a later, non-reversed withdrawal still
 * consumes quotas from this application: silently deleting those
 * allocations would unlink the withdrawal's quota consumption without
 * reverting it. The consuming withdrawal must be reversed first.
 *
 * Once the write transaction commits, the affected portfolio's
 * performance is recalculated from the application date forward, so
 * reversing an application propagates to the historical snapshots.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor and the application id.
 * @returns The reversed {@link ApplicationDto}.
 *
 * @throws {NotFoundError} When the application or its portfolio is not
 *   accessible.
 * @throws {ValidationError} When the application is already reversed, or
 *   when a later, non-reversed withdrawal still consumes its quotas.
 */
export async function reverseApplication(
  unitOfWork: UnitOfWork,
  input: ReverseApplicationInput,
): Promise<ApplicationDto> {
  const { dto, date, portfolioId } = await unitOfWork.run(
    async (tx) => {
      const application = await tx.applications.findById(
        EntityId.create(input.applicationId),
      );

      if (application === null) {
        throw new NotFoundError(
          `Application with id ${input.applicationId} was not found.`,
        );
      }

      const position = await tx.positions.findById(application.positionId);

      if (position === null) {
        throw new NotFoundError(
          `Position with id ${application.positionId} was not found.`,
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

      const allocations =
        await tx.transactionAllocations.findAllByApplicationId(
          EntityId.create(input.applicationId),
        );

      const consumingWithdrawalIds: string[] = [];
      for (const allocation of allocations) {
        if (allocation.withdrawId === undefined) {
          continue;
        }

        const withdrawal = await tx.withdrawals.findById(allocation.withdrawId);

        if (withdrawal === null || withdrawal.reversedAt === null) {
          consumingWithdrawalIds.push(allocation.withdrawId as string);
        }
      }

      if (consumingWithdrawalIds.length > 0) {
        throw new ValidationError(
          `Application with id ${input.applicationId} cannot be reversed because its quotas are still consumed by withdrawal(s) [${consumingWithdrawalIds.join(", ")}]. Reverse the withdrawal(s) first.`,
        );
      }

      for (const allocation of allocations) {
        if (allocation.id === undefined) {
          continue;
        }
        await tx.transactionAllocations.delete(allocation.id);
      }

      const reversed = application.reverse(EntityId.create(input.actorId));
      const saved = await tx.applications.save(reversed);

      return {
        dto: toApplicationDto(saved),
        date: application.date,
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
