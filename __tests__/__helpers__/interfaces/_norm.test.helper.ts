import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { INorm } from "@/business/interfaces/portfolio/norm.interface";

export {
  CATEGORY_ID,
  FRESH_NORM,
  NORM,
  NORM_ID,
  OTHER_CATEGORY_ID,
  OTHER_NORM,
  OTHER_NORM_ID,
  UPDATED_NORM,
} from "@/__tests__/__fixtures__";

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
