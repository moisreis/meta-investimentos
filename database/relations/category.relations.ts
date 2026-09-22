import { defineRelations } from "drizzle-orm"
import { category, fund, norm } from "@db-schemas"

// Connects a category to its funds and norms.
export const categoryRelations = defineRelations(
  { category, fund, norm },
  (r) => ({
    category: {
      funds: r.many.fund({
        from: r.category.id,
        to: r.fund.categoryId,
      }),
      norms: r.many.norm({
        from: r.category.id,
        to: r.norm.categoryId,
      }),
    },
  })
)
