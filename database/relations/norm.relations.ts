import { defineRelations } from "drizzle-orm"
import { category, norm, normsPortfolios } from "@db-schemas"

// Connects a norm to its category and portfolio links.
export const normRelations = defineRelations(
  { category, norm, normsPortfolios },
  (r) => ({
    norm: {
      category: r.one.category({
        from: r.norm.categoryId,
        to: r.category.id,
      }),
      portfolios: r.many.normsPortfolios({
        from: r.norm.id,
        to: r.normsPortfolios.normId,
      }),
    },
  })
)
