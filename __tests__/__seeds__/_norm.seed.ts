import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { Norm } from "@/business/entities/portfolio/norm.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { norm } from "@/infrastructure/database/schemas";
import { seedCategoryById } from "./_category.seed";

/**
 * Represents the default norm fixture
 * with an equity allocation profile.
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
 * Represents an alternate norm fixture
 * with a fixed-income allocation profile.
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
 * Represents a norm fixture with an
 * updated target allocation percentage.
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
 * Represents a norm fixture with a
 * generated ID for insert tests.
 */
const FRESH_NORM = Norm.create({
  articleNumber: "Art. 3",
  name: "Norma Multimercado",
  categoryId: EntityId.create(ID.CATEGORY.DEFAULT),
  minAllocation: SignedPercentage.create("0"),
  maxAllocation: SignedPercentage.create("25"),
  targetAllocation: SignedPercentage.create("12"),
});

export { NORM, OTHER_NORM, UPDATED_NORM, FRESH_NORM };

/**
 * Represents the default norm identifier for tests.
 */
export const NORM_ID = ID.NORM.DEFAULT;

/**
 * Represents the other norm identifier for tests.
 */
export const OTHER_NORM_ID = ID.NORM.OTHER;

/**
 * Seeds the default and alternate norm
 * rows into the database.
 *
 * The function inserts the parent
 * categories before inserting the
 * norm rows.
 *
 * @returns The seeded {@link Norm} array.
 */
export async function seedNorms(): Promise<Norm[]> {
  await seedCategoryById(ID.CATEGORY.DEFAULT);
  await seedCategoryById(ID.CATEGORY.OTHER);

  for (const fixture of [NORM, OTHER_NORM]) {
    await db.insert(norm).values({
      id: fixture.id,
      articleNumber: fixture.articleNumber,
      name: fixture.name,
      categoryId: fixture.categoryId,
      minAllocation: fixture.minAllocation.value.toString(),
      maxAllocation: fixture.maxAllocation.value.toString(),
      targetAllocation: fixture.targetAllocation.value.toString(),
      createdAt: fixture.createdAt,
      updatedAt: fixture.updatedAt,
    });
  }

  return [NORM, OTHER_NORM];
}

/**
 * Seeds only the parent category entities
 * that the norm fixtures depend on.
 */
export async function seedNormFixtureParents(): Promise<void> {
  await seedCategoryById(ID.CATEGORY.DEFAULT);
  await seedCategoryById(ID.CATEGORY.OTHER);
}
