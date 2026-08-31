import { db } from "@/__tests__/__setup__/_database.setup";
import { Category } from "@/business/entities";
import { category } from "@/infrastructure/database/schemas";
import { CategoryRepository } from "@/infrastructure/repositories";

export const CATEGORY_ID = "6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d";
export const OTHER_CATEGORY_ID = "7b8c9d0e-1f2a-4b3c-8d4e-5f6a7b8c9d0e";

export const CATEGORY = Category.create({ name: "Ações" }, CATEGORY_ID);

export const OTHER_CATEGORY = Category.create(
  { name: "Renda Fixa" },
  OTHER_CATEGORY_ID,
);

export const FRESH_CATEGORY = Category.create({ name: "Multimercado" });

export const UPDATED_CATEGORY = Category.create(
  { name: "Ações Brasileiras" },
  CATEGORY_ID,
);

export async function seedCategoryById(id: string): Promise<Category> {
  const REPOSITORY = new CategoryRepository(db);
  const EXISTING = await REPOSITORY.findById(id);
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
