import { calculateApplicationQuotas } from "@/business/calculators";
import { Application } from "@/business/entities/portfolio/application.entity";
import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import type { ApplicationDto } from "./application.dtos";
import { toApplicationDto } from "./application.dtos";

/**
 * Input for {@link createApplication}.
 */
export interface CreateApplicationInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position the application applies to.
   */
  positionId: string;

  /**
   * The date of the application.
   */
  date: Date;

  /**
   * The amount applied, as a decimal string.
   */
  amount: string;
}

/**
 * Creates an application against a position.
 *
 * The action loads the position, resolves its portfolio access, loads
 * the quota price of the fund on the application date, computes the
 * number of quotas via {@link calculateApplicationQuotas}, and creates
 * the application. All writes happen inside one `UnitOfWork`
 * transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, position, date, and amount.
 * @returns The created {@link ApplicationDto}.
 *
 * @throws {NotFoundError} When the position, its portfolio, or the
 *   quota price is not accessible/available.
 * @throws {ValidationError} When the fund has no quota on the date.
 */
export async function createApplication(
  unitOfWork: UnitOfWork,
  input: CreateApplicationInput,
): Promise<ApplicationDto> {
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
      const quotas = calculateApplicationQuotas({
        application: amount,
        quota: quota.price,
      });

      const application = Application.create({
        positionId: EntityId.create(input.positionId),
        date: input.date,
        amount,
        quotas,
      });

      const saved = await tx.applications.save(application);

      return toApplicationDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
