import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Category } from "@/business/entities/fund/category.entity";
import type { ICategory } from "@/business/interfaces/fund/category.interface";

/**
 * Represents the default category identifier for tests.
 */
export const CATEGORY_ID = ID.CATEGORY.DEFAULT;

/**
 * Represents the secondary category identifier for tests.
 */
export const OTHER_CATEGORY_ID = ID.CATEGORY.OTHER;

/**
 * Represents a default category entity with the name
 * "Ações".
 */
export const CATEGORY = Category.create({ name: "Ações" }, ID.CATEGORY.DEFAULT);

/**
 * Represents a secondary category entity with the name
 * "Renda Fixa".
 */
export const OTHER_CATEGORY = Category.create(
  { name: "Renda Fixa" },
  ID.CATEGORY.OTHER,
);

/**
 * Represents a category entity without a predefined
 * identifier. Use this fixture to test insert operations.
 */
export const FRESH_CATEGORY = Category.create({
  name: "Multimercado",
});

/**
 * Represents a category entity with a modified name.
 * Reuses the default category identifier.
 */
export const UPDATED_CATEGORY = Category.create(
  { name: "Ações Brasileiras" },
  ID.CATEGORY.DEFAULT,
);

/**
 * Creates an in-memory repository that implements
 * {@link ICategory}.
 *
 * The repository stores {@link Category} entities in
 * memory and supports find, save, and delete operations.
 *
 * @returns A new in-memory `ICategory` repository instance.
 */
export function createInMemoryCategoryRepository(): ICategory {
  const BASE = createInMemoryRepository<Awaited<ReturnType<ICategory["save"]>>>(
    { extractId: (c) => c.id },
  );

  return {
    findById: (id) => BASE.findById(id),
    async findByName(name) {
      return BASE.findOne((c) => c.name === name);
    },
    save: (category) => BASE.save(category),
    delete: (id) => BASE.delete(id),
  };
}
