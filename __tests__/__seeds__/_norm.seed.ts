import { db } from "@/__tests__/__setup__/_database.setup";
import { Norm } from "@/business/entities";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { norm } from "@/infrastructure/database/schemas";
import {
  CATEGORY_ID,
  OTHER_CATEGORY_ID,
  seedCategoryById,
} from "./_category.seed";

export const NORM_ID = "3e3f4051-6a7b-4c8d-9e0f-1a2b3c4d5e6f";
export const OTHER_NORM_ID = "4f405162-7b8c-4d9e-8f0a-2b3c4d5e6f70";

export const NORM = Norm.create(
  {
    articleNumber: "Art. 1",
    name: "Política de Investimento",
    categoryId: CATEGORY_ID,
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  NORM_ID,
);

export const OTHER_NORM = Norm.create(
  {
    articleNumber: "Art. 2",
    name: "Norma Renda Fixa",
    categoryId: OTHER_CATEGORY_ID,
    minAllocation: SignedPercentage.create("10"),
    maxAllocation: SignedPercentage.create("30"),
    targetAllocation: SignedPercentage.create("18"),
  },
  OTHER_NORM_ID,
);

export const UPDATED_NORM = Norm.create(
  {
    articleNumber: NORM.articleNumber,
    name: NORM.name,
    categoryId: NORM.categoryId,
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("14"),
  },
  NORM_ID,
);

export const FRESH_NORM = Norm.create({
  articleNumber: "Art. 3",
  name: "Norma Multimercado",
  categoryId: CATEGORY_ID,
  minAllocation: SignedPercentage.create("0"),
  maxAllocation: SignedPercentage.create("25"),
  targetAllocation: SignedPercentage.create("12"),
});

export async function seedNorms(): Promise<Norm[]> {
  await seedCategoryById(CATEGORY_ID);
  await seedCategoryById(OTHER_CATEGORY_ID);

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

export async function seedNormFixtureParents(): Promise<void> {
  await seedCategoryById(CATEGORY_ID);
  await seedCategoryById(OTHER_CATEGORY_ID);
}
