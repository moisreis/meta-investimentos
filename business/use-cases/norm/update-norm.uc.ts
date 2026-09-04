import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";
import type { NormDto } from "./norm.dtos";
import { toNormDto } from "./norm.dtos";

/**
 * Input for {@link updateNorm}.
 */
export interface UpdateNormInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the norm to update.
   */
  normId: string;

  /**
   * The new article number of the norm.
   */
  articleNumber?: string;

  /**
   * The new name of the norm.
   */
  name?: string;

  /**
   * The new fund category id the norm constrains.
   */
  categoryId?: string;

  /**
   * The new minimum allocation, as a decimal string.
   */
  minAllocation?: string;

  /**
   * The new maximum allocation, as a decimal string.
   */
  maxAllocation?: string;

  /**
   * The new target allocation, as a decimal string.
   */
  targetAllocation?: string;
}

/**
 * Updates a regulatory norm.
 *
 * Reference and administration mutations are restricted to managers.
 * The update runs inside one `UnitOfWork` transaction so the change and
 * its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The update input.
 * @returns The updated {@link NormDto}.
 *
 * @throws {NotFoundError} When the actor is not a manager, the norm or
 *   the referenced category does not exist.
 */
export async function updateNorm(
  unitOfWork: UnitOfWork,
  input: UpdateNormInput,
): Promise<NormDto> {
  return unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.norms.findById(EntityId.create(input.normId));

      if (existing === null) {
        throw new NotFoundError(`Norm with id ${input.normId} was not found.`);
      }

      if (input.categoryId !== undefined) {
        const category = await tx.categories.findById(
          EntityId.create(input.categoryId),
        );

        if (category === null) {
          throw new NotFoundError(
            `Category with id ${input.categoryId} was not found.`,
          );
        }
      }

      const updated = existing.update(
        {
          articleNumber: input.articleNumber,
          name: input.name,
          categoryId:
            input.categoryId === undefined
              ? undefined
              : EntityId.create(input.categoryId),
          minAllocation:
            input.minAllocation === undefined
              ? undefined
              : SignedPercentage.create(input.minAllocation),
          maxAllocation:
            input.maxAllocation === undefined
              ? undefined
              : SignedPercentage.create(input.maxAllocation),
          targetAllocation:
            input.targetAllocation === undefined
              ? undefined
              : SignedPercentage.create(input.targetAllocation),
        },
        new Date(),
      );

      const saved = await tx.norms.save(updated);

      return toNormDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
