import { defineRelations } from "drizzle-orm";
import { category, fund, norm } from "../../schemas";

/**
 * Defines the relations applicable to the `category` table.
 *
 * A category can own multiple {@link fund} and {@link norm} rows,
 * linked through the `categoryId` foreign keys.
 */
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
  }),
);
