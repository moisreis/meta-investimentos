import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { ICategory } from "@/business/interfaces/fund/category.interface";

export {
  CATEGORY,
  CATEGORY_ID,
  FRESH_CATEGORY,
  OTHER_CATEGORY,
  OTHER_CATEGORY_ID,
  UPDATED_CATEGORY,
} from "@/__tests__/__fixtures__";

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
