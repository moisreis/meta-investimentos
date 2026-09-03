import { Norm } from "@/business/entities/portfolio/norm.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { NormDto } from "./norm.dtos";
import { toNormDto } from "./norm.dtos";

/**
 * Input for {@link createNorm}.
 */
export interface CreateNormInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The article number of the norm.
   */
  articleNumber: string;

  /**
   * The name of the norm.
   */
  name: string;

  /**
   * The id of the fund category the norm constrains.
   */
  categoryId: string;

  /**
   * The minimum allocation, as a decimal string.
   */
  minAllocation: string;

  /**
   * The maximum allocation, as a decimal string.
   */
  maxAllocation: string;

  /**
   * The target allocation, as a decimal string.
   */
  targetAllocation: string;
}

/**
 * Creates a regulatory norm.
 *
 * The norm is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The norm properties.
 * @returns The created {@link NormDto}.
 *
 * @throws {NotFoundError} When the referenced category does not exist.
 */
export async function createNorm(
  unitOfWork: UnitOfWork,
  input: CreateNormInput,
): Promise<NormDto> {
  return unitOfWork.run(
    async (tx) => {
      const categoryId = EntityId.create(input.categoryId);

      const category = await tx.categories.findById(categoryId);

      if (category === null) {
        throw new NotFoundError(
          `Category with id ${input.categoryId} was not found.`,
        );
      }

      const norm = Norm.create({
        articleNumber: input.articleNumber,
        name: input.name,
        categoryId,
        minAllocation: SignedPercentage.create(input.minAllocation),
        maxAllocation: SignedPercentage.create(input.maxAllocation),
        targetAllocation: SignedPercentage.create(input.targetAllocation),
      });

      const saved = await tx.norms.save(norm);

      return toNormDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
