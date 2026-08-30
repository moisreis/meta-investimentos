import { defineRelations } from "drizzle-orm";
import { fund, quota } from "../../schemas";

/**
 * Defines the relations applicable to the `quota` table.
 *
 * A quota record always belongs to exactly one {@link fund}, linked
 * through the `fundId` foreign key.
 */
export const quotaRelations = defineRelations({ fund, quota }, (r) => ({
  quota: {
    fund: r.one.fund({
      from: r.quota.fundId,
      to: r.fund.id,
    }),
  },
}));
