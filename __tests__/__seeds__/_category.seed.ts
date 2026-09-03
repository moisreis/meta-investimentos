import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { Category } from "@/business/entities/fund/category.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { category } from "@/infrastructure/database/schemas";
import { CategoryRepository } from "@/infrastructure/repositories";

/**
 * Represents the default category ID used in tests.
 */
export const CATEGORY_ID = ID.CATEGORY.DEFAULT;

/**
 * Represents an alternative category ID used in tests.
 */
export const OTHER_CATEGORY_ID = ID.CATEGORY.OTHER;

/**
 * Represents the default category fixture used in tests.
 *
 * The fixture represents the "Ações" category.
 */
export const CATEGORY = Category.create({ name: "Ações" }, ID.CATEGORY.DEFAULT);

/**
 * Represents an alternative category fixture for tests.
 *
 * The fixture represents the "Renda Fixa" category.
 */
export const OTHER_CATEGORY = Category.create(
  { name: "Renda Fixa" },
  ID.CATEGORY.OTHER,
);

/**
 * Represents a category fixture without a predefined ID.
 *
 * The fixture represents the "Multimercado" category.
 */
export const FRESH_CATEGORY = Category.create({ name: "Multimercado" });

/**
 * Represents an updated version of the default category fixture.
 *
 * The fixture reuses the default category ID but updates
 * the name to "Ações Brasileiras".
 */
export const UPDATED_CATEGORY = Category.create(
  { name: "Ações Brasileiras" },
  ID.CATEGORY.DEFAULT,
);

/**
 * Seeds a category into the test database by ID.
 *
 * The function checks if the category already exists. If
 * it does, the existing record is returned. Otherwise, the
 * appropriate fixture is inserted.
 *
 * @param id - The category ID to seed.
 * @returns A promise that resolves to the seeded
 *          `Category` fixture.
 */
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

/**
 * Seeds the default categories into the test database.
 *
 * The function calls `seedCategoryById` for each default
 * category ID.
 *
 * @returns A promise that resolves to an array containing
 *          the seeded `Category` fixtures.
 */
export async function seedCategories(): Promise<Category[]> {
  return [
    await seedCategoryById(CATEGORY_ID),
    await seedCategoryById(OTHER_CATEGORY_ID),
  ];
}
