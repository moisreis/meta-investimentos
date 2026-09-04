import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

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
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor and the application id.
 * @returns The reversed {@link ApplicationDto}.
 *
 * @throws {NotFoundError} When the application or its portfolio is not
 *   accessible.
 * @throws {ValidationError} When the application is already reversed.
 */
export async function reverseApplication(
  unitOfWork: UnitOfWork,
  input: ReverseApplicationInput,
): Promise<ApplicationDto> {
  return unitOfWork.run(
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

      for (const allocation of allocations) {
        if (allocation.id === undefined) {
          continue;
        }
        await tx.transactionAllocations.delete(allocation.id);
      }

      const reversed = application.reverse(EntityId.create(input.actorId));
      const saved = await tx.applications.save(reversed);

      return toApplicationDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
