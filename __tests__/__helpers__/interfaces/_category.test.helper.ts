import { Category } from "@/business/entities/fund/category.entity";
import type { ICategory } from "@/business/interfaces/fund/category.interface";

export const CATEGORY_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

export const CATEGORY = Category.create({ name: "Ações" }, CATEGORY_ID);

export function createInMemoryCategoryRepository(): ICategory {
  const ROWS = new Map<string, Category>();

  return {
    async findById(id: string): Promise<Category | null> {
      return ROWS.get(id) ?? null;
    },

    async findByName(name: string): Promise<Category | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.name === name) return ROW;
      }

      return null;
    },

    async save(category: Category): Promise<Category> {
      ROWS.set(category.id ?? "generated-id", category);

      return category;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
