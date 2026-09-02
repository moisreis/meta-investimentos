import {
  CATEGORY,
  CATEGORY_ID,
  FRESH_CATEGORY,
  OTHER_CATEGORY,
  OTHER_CATEGORY_ID,
  UPDATED_CATEGORY,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Category } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { category } from "@/infrastructure/database/schemas";
import { CategoryRepository } from "@/infrastructure/repositories";

export {
  CATEGORY_ID,
  OTHER_CATEGORY_ID,
  CATEGORY,
  OTHER_CATEGORY,
  FRESH_CATEGORY,
  UPDATED_CATEGORY,
};

export async function seedCategoryById(id: string): Promise<Category> {
  const REPOSITORY = new CategoryRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
  if (EXISTING) return EXISTING;

  const FIXTURE = id === CATEGORY_ID ? CATEGORY : OTHER_CATEGORY;

  await db.insert(category).values({
    id: FIXTURE.id,
    name: FIXTURE.name,
    createdAt: FIXTURE.createdAt,
    updatedAt: FIXTURE.updatedAt,
  });

  return FIXTURE;
}

export async function seedCategories(): Promise<Category[]> {
  return [
    await seedCategoryById(CATEGORY_ID),
    await seedCategoryById(OTHER_CATEGORY_ID),
  ];
}
