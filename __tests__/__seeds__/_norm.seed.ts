import {
  CATEGORY_ID,
  FRESH_NORM,
  NORM,
  NORM_ID,
  OTHER_CATEGORY_ID,
  OTHER_NORM,
  OTHER_NORM_ID,
  UPDATED_NORM,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Norm } from "@/business/entities";
import { norm } from "@/infrastructure/database/schemas";
import { seedCategoryById } from "./_category.seed";

export { NORM_ID, OTHER_NORM_ID, NORM, OTHER_NORM, UPDATED_NORM, FRESH_NORM };

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
