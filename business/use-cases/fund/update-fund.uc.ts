import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";
import type { FundDto } from "./fund.dtos";
import { toFundDto } from "./fund.dtos";

/**
 * Input for {@link updateFund}.
 */
export interface UpdateFundInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the fund to update.
   */
  fundId: string;

  /**
   * The new name of the fund.
   */
  name?: string;

  /**
   * The new administration fee, as a decimal string. Pass `null` to
   * clear the fee.
   */
  administrationFee?: string | null;

  /**
   * The new performance fee, as a decimal string. Pass `null` to clear
   * the fee.
   */
  performanceFee?: string | null;

  /**
   * The new benchmark id. Pass `null` to clear the benchmark.
   */
  benchmarkId?: string | null;

  /**
   * The new category id. Pass `null` to clear the category.
   */
  categoryId?: string | null;
}

/**
 * Updates a fund.
 *
 * Reference and administration mutations are restricted to managers.
 * The update runs inside one `UnitOfWork` transaction so the change and
 * its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The update input.
 * @returns The updated {@link FundDto}.
 *
 * @throws {NotFoundError} When the actor is not a manager, the fund,
 *   benchmark or category does not exist.
 */
export async function updateFund(
  unitOfWork: UnitOfWork,
  input: UpdateFundInput,
): Promise<FundDto> {
  return unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.funds.findById(EntityId.create(input.fundId));

      if (existing === null) {
        throw new NotFoundError(`Fund with id ${input.fundId} was not found.`);
      }

      if (input.benchmarkId !== undefined && input.benchmarkId !== null) {
        const benchmark = await tx.benchmarks.findById(
          EntityId.create(input.benchmarkId),
        );

        if (benchmark === null) {
          throw new NotFoundError(
            `Benchmark with id ${input.benchmarkId} was not found.`,
          );
        }
      }

      if (input.categoryId !== undefined && input.categoryId !== null) {
        const category = await tx.categories.findById(
          EntityId.create(input.categoryId),
        );

        if (category === null) {
          throw new NotFoundError(
            `Category with id ${input.categoryId} was not found.`,
          );
        }
      }

      const updated = existing.update({
        name: input.name,
        administrationFee:
          input.administrationFee === undefined
            ? undefined
            : input.administrationFee === null
              ? null
              : SignedPercentage.create(input.administrationFee),
        performanceFee:
          input.performanceFee === undefined
            ? undefined
            : input.performanceFee === null
              ? null
              : SignedPercentage.create(input.performanceFee),
        benchmarkId:
          input.benchmarkId === undefined
            ? undefined
            : input.benchmarkId === null
              ? null
              : EntityId.create(input.benchmarkId),
        categoryId:
          input.categoryId === undefined
            ? undefined
            : input.categoryId === null
              ? null
              : EntityId.create(input.categoryId),
      });

      const saved = await tx.funds.save(updated);

      return toFundDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
