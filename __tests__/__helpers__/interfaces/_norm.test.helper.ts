import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Norm } from "@/business/entities/portfolio/norm.entity";
import type { INorm } from "@/business/interfaces/portfolio/norm.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents a default norm entity with allocation bounds
 * for the investment policy article.
 */
const NORM = Norm.create(
  {
    articleNumber: "Art. 1",
    name: "Política de Investimento",
    categoryId: EntityId.create(ID.CATEGORY.DEFAULT),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  ID.NORM.DEFAULT,
);

/**
 * Represents a secondary norm entity with different
 * allocation bounds for the fixed income article.
 */
const OTHER_NORM = Norm.create(
  {
    articleNumber: "Art. 2",
    name: "Norma Renda Fixa",
    categoryId: EntityId.create(ID.CATEGORY.OTHER),
    minAllocation: SignedPercentage.create("10"),
    maxAllocation: SignedPercentage.create("30"),
    targetAllocation: SignedPercentage.create("18"),
  },
  ID.NORM.OTHER,
);

/**
 * Represents a norm entity with an updated target
 * allocation. Reuses the default norm identifier.
 */
const UPDATED_NORM = Norm.create(
  {
    articleNumber: NORM.articleNumber,
    name: NORM.name,
    categoryId: NORM.categoryId,
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("14"),
  },
  ID.NORM.DEFAULT,
);

/**
 * Represents a norm entity without a predefined
 * identifier. Use this fixture to test insert operations.
 */
const FRESH_NORM = Norm.create({
  articleNumber: "Art. 3",
  name: "Norma Multimercado",
  categoryId: EntityId.create(ID.CATEGORY.DEFAULT),
  minAllocation: SignedPercentage.create("0"),
  maxAllocation: SignedPercentage.create("25"),
  targetAllocation: SignedPercentage.create("12"),
});

/**
 * Represents the default norm entity re-exported for
 * convenience.
 */
/**
 * Represents the secondary norm entity re-exported for
 * convenience.
 */
/**
 * Represents the updated norm entity re-exported for
 * convenience.
 */
/**
 * Represents the fresh norm entity re-exported for
 * convenience.
 */
export { NORM, OTHER_NORM, UPDATED_NORM, FRESH_NORM };

/**
 * Represents the default norm identifier for tests.
 */
export const NORM_ID = ID.NORM.DEFAULT;

/**
 * Represents the default category identifier referenced by
 * {@link NORM}.
 */
export const CATEGORY_ID = ID.CATEGORY.DEFAULT;

/**
 * Represents the other category identifier referenced by
 * {@link OTHER_NORM}.
 */
export const OTHER_CATEGORY_ID = ID.CATEGORY.OTHER;

/**
 * Creates an in-memory repository that implements
 * {@link INorm}.
 *
 * The repository stores {@link Norm} entities in memory
 * and supports find, save, and delete operations.
 *
 * @returns A new in-memory `INorm` repository instance.
 */
export function createInMemoryNormRepository(): INorm {
  const BASE = createInMemoryRepository<Awaited<ReturnType<INorm["save"]>>>({
    extractId: (n) => n.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByCategoryId(categoryId) {
      return BASE.match((n) => n.categoryId === categoryId);
    },
    save: (norm) => BASE.save(norm),
    delete: (id) => BASE.delete(id),
  };
}
