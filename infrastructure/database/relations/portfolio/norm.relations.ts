import { defineRelations } from "drizzle-orm";
import { category, norm, normsPortfolios } from "../../schemas";

/**
 * Defines the relations applicable to the `norm` table.
 *
 * A norm always belongs to exactly one {@link category} and can be
 * linked to multiple portfolios through the {@link normsPortfolios}
 * join table, referenced through its foreign keys.
 */
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
  }),
);
